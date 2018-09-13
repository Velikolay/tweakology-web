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

const valueWithPrefix = (props, name) => deepValue(
  props.values,
  nameWithPrefix(props, name),
);

const formikValueWithPrefix = (props, name) => deepValue(
  props.formik.values,
  nameWithPrefix(props, name),
);

const titleForField = (props, fieldName, defaultTitle) => {
  if (props.titles && fieldName in props.titles) {
    return props.titles[fieldName];
  }
  return defaultTitle;
};

export {
  nameWithPrefix, valueWithPrefix, formikValueWithPrefix, titleForField,
};
