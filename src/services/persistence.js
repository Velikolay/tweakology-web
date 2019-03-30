// @flow

export default {
  readAll: (): { string: any } => {
    const items = {};
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const id = window.localStorage.key(i);
      items[id] = JSON.parse(window.localStorage.getItem(id));
    }
    return items;
  },
  read: (key: string, property: ?string): ?any => {
    const item = window.localStorage.getItem(key);
    const obj = item && item !== null ? JSON.parse(item) : null;
    if (property && property !== null) {
      return obj !== null ? obj[property] : null;
    }
    return obj;
  },
  write: (key: string, obj: any) =>
    window.localStorage.setItem(key, JSON.stringify(obj)),
  clear: () => window.localStorage.clear(),
};
