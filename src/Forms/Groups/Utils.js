const nameWithPrefix = (props, name) => {
  if (props.prefix) {
    return props.prefix + '.' + name;
  }
  return name;
}

const valueWithPrefix = (props, name) => {
  return deep_value(props.values, nameWithPrefix(props, name))
}

const deep_value = (obj, path) => {
  for (var i=0, path=path.split('.'), len=path.length; i<len; i++) {
      obj = obj[path[i]];
  };
  return obj;
};

const titleForField = (props, fieldName, defaultTitle) => {
  if(props.titles && fieldName in props.titles) {
    return props.titles[fieldName];
  }
  return defaultTitle;
}

export { nameWithPrefix, valueWithPrefix, titleForField };