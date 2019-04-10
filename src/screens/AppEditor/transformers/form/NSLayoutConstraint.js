// @flow
import type {
  NSLayoutConstraint as ConstraintPayload,
  NSLayoutConstraintAttributeItem as ConstraintItemAttributePayload,
} from '../../../../services/device/types';
import type {
  NSLayoutConstraint as ConstraintForm,
  NSLayoutConstraintItemAttribute as ConstraintItemAttributeForm,
} from '../../../../containers/Form/types';
import withFalsyGuard from './utils';
import { attributeToModifiers } from '../../../../services/device/metadata/NSLayoutConstraint';

const emptyItem = (placeholder: string): ConstraintItemAttributeForm => ({
  attribute: {
    value: '',
  },
  item: {
    value: '',
    placeholder,
  },
});

const toItem = (
  payloadItem: ?ConstraintItemAttributePayload,
  placeholder: string,
): ConstraintItemAttributeForm => {
  if (!payloadItem) {
    return emptyItem(placeholder);
  }

  const attrVal = payloadItem.attribute.toString();
  const item: ConstraintItemAttributeForm = {
    attribute: {
      value: attrVal,
    },
    item: {
      value: payloadItem.item,
      placeholder,
    },
  };
  if (attrVal) {
    const [relativeToMargin, respectLanguageDirection] = attributeToModifiers[
      attrVal
    ];
    item.attribute.relativeToMargin = relativeToMargin;
    item.attribute.respectLanguageDirection = respectLanguageDirection;
  }
  return item;
};

const NSLayoutConstraintTransformer = {
  fromPayload: ({
    first,
    second,
    relation,
    multiplier,
    constant,
    priority,
    isActive,
    meta,
    itemOptions,
  }: ConstraintPayload): ConstraintForm => {
    const formikProps = {
      meta: {
        synced: true,
        ...meta,
      },
      first: toItem(first, 'Item1'),
      second: toItem(second, 'Item2'),
      relation: relation.toString(),
      multiplier,
      constant,
      isActive,
      priority,
      itemOptions,
    };
    return formikProps;
  },

  toPayload: ({
    first,
    second,
    relation,
    multiplier,
    constant,
    priority,
    isActive,
    meta,
  }: ConstraintForm): ConstraintPayload => {
    const payload: ConstraintPayload = {
      meta,
      first: {
        item: first.item.value,
        attribute: parseInt(first.attribute.value, 10),
      },
      relation: parseInt(relation, 10),
      multiplier,
      constant,
      isActive,
      priority,
    };

    if (second && second.attribute.value && second.item.value) {
      payload.second = {
        item: second.item.value,
        attribute: parseInt(second.attribute.value, 10),
      };
    }
    return payload;
  },
};

export default withFalsyGuard(NSLayoutConstraintTransformer);
