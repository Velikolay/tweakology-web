import { attributeToModifiers } from '../../Static/Constraints';

const ConstraintTransformer = {

  payloadToFormikProps: (payload) => {
    const formikProps = {
      first: toFormikItem(payload.first, 'Item1'),
      isActive: payload.isActive,
      relation: payload.relation,
      multiplier: payload.multiplier,
      constant: payload.constant,
      priority: payload.priority
    };

    if (payload.second) {
      formikProps.second = toFormikItem(payload.second, 'Item2');
    } else {
      formikProps.second = {
        attribute: {
          value: ''
        },
        item: {
          value: '',
          placeholder: 'Item2'
        }
      }
    }
    return formikProps;
  },

  formikPropsToPayload: (props) => {
    return props;
  }
};

const toFormikItem = (payloadItem, placeholder) => {
  const attrVal = payloadItem.attribute.value.toString();
  const item = {
    attribute: {
      value: attrVal
    },
    item: {
      value: payloadItem.item.value,
      placeholder: placeholder
    }
  };
  if (attrVal) {
    const mods = attributeToModifiers[attrVal];
    item.attribute.relativeToMargin = mods[0];
    item.attribute.respectLanguageDirection = mods[1];
  }
  return item;
};

export default ConstraintTransformer;