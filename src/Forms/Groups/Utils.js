const nameWithPrefix = (props, name) => {
  if (props.prefix) {
    return `${props.prefix}.${name}`;
  }
  return name;
};

const deepValue = (obj, path) => {
  let res = obj;
  for (let i = 0, pathSegments = path.split('.'), len = pathSegments.length; i < len; i += 1) {
    res = res[pathSegments[i]];
  }
  return res;
};

const formikValueWithPrefix = (props, name) => deepValue(
  props.formik.values,
  nameWithPrefix(props, name),
);

const formikInitialValueWithPrefix = (props, name) => deepValue(
  props.formik.initialValues,
  nameWithPrefix(props, name),
);

const isValueDirty = (
  props,
  name,
) => formikInitialValueWithPrefix(props, name) !== formikValueWithPrefix(props, name);

const titleForField = (props, fieldName, defaultTitle) => {
  if (props.titles && fieldName in props.titles) {
    return props.titles[fieldName];
  }
  return defaultTitle;
};

export {
  nameWithPrefix,
  formikValueWithPrefix,
  formikInitialValueWithPrefix,
  isValueDirty,
  titleForField,
};
