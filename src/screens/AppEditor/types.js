// @flow
import type {
  AnyUIView,
  NSLayoutConstraint,
} from '../../services/device/types';

type BaseNode = {
  module: string,
  collapsed?: boolean,
  leaf?: boolean,
};

export type UIViewNode<T: AnyUIView> = BaseNode & {
  id: string,
  name: string,
  type: string,
  imgUrl: string,
  revision: number,
  properties: T,
  updatedProperties: T,
  superview?: UIViewNode<AnyUIView>,
  children: any[],
};

export type ConstraintNode<T: AnyUIView> = BaseNode & {
  id: string,
  type: string,
  properties: NSLayoutConstraint,
  updatedProperties: NSLayoutConstraint,
  superview: UIViewNode<T>,
};

export type ConstraintNodeContainer<T: AnyUIView> = BaseNode & {
  superview: UIViewNode<T>,
  children: ConstraintNode<T>[],
};

export type UITree = UIViewNode<AnyUIView>;
