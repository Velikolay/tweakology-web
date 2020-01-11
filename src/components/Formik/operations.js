export const deepValue = (obj, path) => {
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

export const nameWithPrefix = (props, name) => {
  if (props.prefix) {
    return `${props.prefix}.${name}`;
  }
  return name;
};

export const formikValueWithPrefix = (formik, props, name) =>
  deepValue(formik.values, nameWithPrefix(props, name));

export const formikInitialValueWithPrefix = (formik, props, name) =>
  deepValue(formik.initialValues, nameWithPrefix(props, name));

export const isValueDirty = (formik, props, name) =>
  formikInitialValueWithPrefix(formik, props, name) !==
  formikValueWithPrefix(formik, props, name);

export const titleForField = (props, fieldName, defaultTitle) => {
  if (props.titles && fieldName in props.titles) {
    return props.titles[fieldName];
  }
  return defaultTitle;
};
