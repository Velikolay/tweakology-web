import { attributeToModifiers } from '../../../../services/device/metadata/NSLayoutConstraints';

const emptyItem = placeholder => ({
  attribute: {
    value: '',
  },
  item: {
    value: '',
    placeholder,
  },
});

const toItem = (payloadItem, placeholder) => {
  if (!payloadItem) {
    return emptyItem(placeholder);
  }

  const attrVal = payloadItem.attribute.toString();
  const item = {
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
  }) => {
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
  }) => {
    const payload = {
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

export default NSLayoutConstraintTransformer;
