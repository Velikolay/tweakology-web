// @flow
import type {
  AnyUIView,
  NSLayoutConstraint,
  DeviceUITreeData,
  DeviceSystemData,
  DeviceRuntimeData,
} from '../../services/device/types';
import type {
  UITree,
  UIViewNode,
  ConstraintNode,
  ConstraintNodeContainer,
} from './types';

import DeviceConnector from '../../services/device/connector';
import APIClient from '../../services/device/api-client';

import PersistenceService from '../../services/persistence';

import getTransformer from './transformers/form';
import NSLayoutConstraintTransformer from './transformers/form/NSLayoutConstraint';

import { getConstraintItemOptions, constraintNodeName } from './tree-manip';

import {
  getEventHandlerIds,
  getAllWorkflowAssets,
} from './components/Workflow';

export const readPersistedConstraints = (): { [string]: any[] } => {
  const constraints = {};
  Object.entries(PersistenceService.readAll()).forEach(
    ([id, form]: [string, any]) => {
      if (
        form.type === 'NSLayoutConstraint' &&
        (form.dirty || form.values.meta.added)
      ) {
        const viewId = id.split('.')[0];
        if (!(viewId in constraints)) {
          constraints[viewId] = [];
        }
        constraints[viewId].push(form);
      }
    },
  );

  const getIndex = c => parseInt(c.id.split(':')[1], 10);
  // https://github.com/facebook/flow/issues/2221
  // $FlowFixMe - Object.values currently has poor flow support
  (Object.values(constraints): any).forEach((viewConstraints: any[]) =>
    viewConstraints.sort((a, b) => getIndex(a) - getIndex(b)),
  );

  return constraints;
};

const constraintsNodeFromPayload = (
  node: UIViewNode<AnyUIView>,
  constraints: NSLayoutConstraint[],
): ConstraintNodeContainer<AnyUIView> => {
  const lastIdx = constraints.length - 1;
  const constraintsByView = readPersistedConstraints();
  if (node.id in constraintsByView) {
    const localOnly = constraintsByView[node.id]
      .filter(
        c => c.values.meta.added && parseInt(c.id.split(':')[1], 10) > lastIdx,
      )
      .map(c => c.values)
      .map(NSLayoutConstraintTransformer.toPayload);
    constraints.push(...localOnly);
  }

  const itemOptions = getConstraintItemOptions(node);
  const children = constraints.map((properties, idx) => {
    const id = `${node.id}.constraints:${idx}`;
    const updatedProperties = NSLayoutConstraintTransformer.toPayload(
      PersistenceService.read(id, 'values'),
    );

    const cNode: ConstraintNode<AnyUIView> = {
      module: '',
      superview: node,
      type: 'NSLayoutConstraint',
      id,
      properties: {
        ...properties,
        itemOptions,
      },
      updatedProperties,
      leaf: true,
    };
    cNode.module = constraintNodeName(cNode);
    return cNode;
  });

  return {
    module: 'Constraints',
    superview: node,
    collapsed: true,
    children,
  };
};

const uiTreeFromPayload = (
  node: DeviceUITreeData,
  revision: number,
  endpoint: string,
): UITree => {
  const {
    uid: { value: id, kind },
    name,
    type,
    properties,
    constraints,
    subviews,
  } = node;

  const treeNode: UIViewNode<AnyUIView> = {
    module: kind === 0 ? name : id,
    id,
    name,
    type,
    revision,
    imgUrl: `${endpoint}/images/${id}`,
    properties,
    updatedProperties: getTransformer(type).toPayload(
      PersistenceService.read(id, 'values'),
    ),
    children: [],
  };

  if (subviews) {
    for (const subview of subviews) {
      const childTree = uiTreeFromPayload(subview, revision, endpoint);
      childTree.superview = treeNode;
      treeNode.children.push(childTree);
    }
  }

  if (constraints && constraints.length > 0) {
    treeNode.children.push(constraintsNodeFromPayload(treeNode, constraints));
  }

  if (treeNode.children.length === 0) {
    treeNode.leaf = true;
  }

  return treeNode;
};

const viewConstraintsChanges = (tree: UITree): ?any => {
  let changes = [];
  const bottomNode =
    tree.children && tree.children.length > 0
      ? tree.children[tree.children.length - 1]
      : null;

  if (bottomNode && bottomNode.module === 'Constraints') {
    changes = bottomNode.children
      .filter(constraint => constraint.updatedProperties)
      .map(constraint => ({
        idx: parseInt(constraint.id.split(':')[1], 10),
        ...constraint.updatedProperties,
      }));
  }

  return changes.length !== 0 ? changes : null;
};

const viewChanges = (tree: UITree): ?any => {
  const constraints = viewConstraintsChanges(tree);
  const eventHandlers = getEventHandlerIds(tree.id);
  const changes = {};

  if (tree.updatedProperties) {
    changes.frame = tree.updatedProperties.frame; // TODO: delete when engine expects the frame in properties
    changes.properties = tree.updatedProperties;
  }

  if (constraints) {
    changes.constraints = constraints;
  }

  if (eventHandlers.length > 0) {
    changes.eventHandlers = eventHandlers;
  }

  return Object.keys(changes).length !== 0 ? changes : null;
};

const treeToPayload = (tree: UITree): any => {
  const payload = [];
  const changes = viewChanges(tree);

  if (changes) {
    payload.push({
      operation: 'modify',
      view: {
        id: tree.id,
        ...changes,
      },
    });
  }

  if (tree.children) {
    payload.push(
      ...tree.children
        .map(subtree =>
          subtree.module !== 'Constraints' ? treeToPayload(subtree) : [],
        )
        .reduce((x, y) => x.concat(y), []),
    );
  }

  return payload;
};

class APIClientAdapter {
  apiClient: APIClient;

  constructor(deviceConnector: DeviceConnector) {
    this.apiClient = new APIClient(deviceConnector);
  }

  fetchTree(): Promise<UITree> {
    const endpoint = this.apiClient.getEndpoint() || ''; // TODO: delete when engine returns full img urls
    return this.apiClient.fetchTree().then((deviceUITree: DeviceUITreeData) => {
      const revision = Date.now();
      return uiTreeFromPayload(deviceUITree, revision, endpoint);
    });
  }

  fetchSystemData(): Promise<DeviceSystemData> {
    return this.apiClient.fetchSystemData();
  }

  fetchRuntimeData(): Promise<DeviceRuntimeData> {
    return this.apiClient.fetchRuntimeData();
  }

  modifyTree(name: string, tree: UITree): Promise<any> {
    const treeChanges = treeToPayload(tree);
    const { eventHandlers, actions } = getAllWorkflowAssets();
    console.log({
      tree: treeChanges,
      eventHandlers,
      actions,
    });
    return this.apiClient.submitChanges(name, treeChanges);
  }

  insertNode(
    name: string,
    activeNode: UIViewNode<AnyUIView>,
    { id, type, ...props }: any,
  ): Promise<any> {
    const containerNode =
      ['UIButton', 'UILabel', 'UIImageView'].indexOf(activeNode.type) === -1
        ? activeNode
        : activeNode.superview;

    if (containerNode) {
      const { children, id: superview } = containerNode;
      const index =
        children && children[children.length - 1].module === 'Constraints'
          ? children.length - 1
          : children.length;

      const payload = [
        {
          operation: 'insert',
          view: {
            id,
            superview,
            index,
            type,
            ...props,
          },
        },
      ];
      return this.apiClient.submitChanges(name, payload);
    }
    return Promise.reject(new Error('Inserting a node requires a container'));
  }
}

export default APIClientAdapter;
