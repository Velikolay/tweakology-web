const deepValue = (obj, path) => {
  let res = obj;
  for (
    let i = 0, pathSegments = path.split('.'), len = pathSegments.length;
    i < len;
    i += 1
  ) {
    res = res[pathSegments[i]];
  }
  return res;
};

const nameWithPrefix = (props, name) => {
  if (props.prefix) {
    return `${props.prefix}.${name}`;
  }
  return name;
};

const formikValueWithPrefix = (formik, props, name) =>
  deepValue(formik.values, nameWithPrefix(props, name));

const formikInitialValueWithPrefix = (formik, props, name) =>
  deepValue(formik.initialValues, nameWithPrefix(props, name));

const isValueDirty = (formik, props, name) =>
  formikInitialValueWithPrefix(formik, props, name) !==
  formikValueWithPrefix(formik, props, name);

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
