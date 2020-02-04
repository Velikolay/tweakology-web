// @flow
export const deepValue = (obj: any, path: string): ?any => {
  let res = obj;
  for (
    let i = 0, pathSegments = path.split('.'), len = pathSegments.length;
    i < len;
    i += 1
  ) {
    if (pathSegments[i] in res) {
      res = res[pathSegments[i]];
    } else {
      return null;
    }
  }
  return res;
};

export const nameWithPrefix = (props: any, name: string) => {
  if (props.prefix) {
    return `${props.prefix}.${name}`;
  }
  return name;
};

export const formikValueWithPrefix = (
  formik: any,
  props: any,
  name: string,
): any => deepValue(formik.values, nameWithPrefix(props, name));

export const formikInitialValueWithPrefix = (
  formik: any,
  props: any,
  name: string,
) => deepValue(formik.initialValues, nameWithPrefix(props, name));

export const isValueDirty = (formik: any, props: any, name: string) =>
  formikInitialValueWithPrefix(formik, props, name) !==
  formikValueWithPrefix(formik, props, name);

export const titleForField = (
  props: any,
  fieldName: string,
  defaultTitle: string,
) => {
  if (props.titles && fieldName in props.titles) {
    return props.titles[fieldName];
  }
  return defaultTitle;
};
