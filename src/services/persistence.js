// @flow

export default {
  read: (key: string, property: ?string): ?any => {
    const item = window.localStorage.getItem(key);
    const obj = item && item !== null ? JSON.parse(item) : null;
    if (property && property !== null) {
      return obj !== null ? obj[property] : null;
    }
    return obj;
  },
  write: (key: string, obj: any) => {
    window.localStorage.setItem(key, JSON.stringify(obj));
  },
};
