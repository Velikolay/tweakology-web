// @flow
import type { MutableListElement } from './types';
import PersistenceService from '../../services/persistence';

export const readList = (id: string): ?(MutableListElement[]) => {
  return PersistenceService.read(`${id}.list`);
};

export const writeList = (
  id: string,
  list: MutableListElement[],
): ?(MutableListElement[]) => {
  return PersistenceService.write(`${id}.list`, list);
};

export const readItem = (id: string, property?: string): ?any => {
  return PersistenceService.read(id, property);
};

export const writeItem = (id: string, item: any) => {
  return PersistenceService.write(id, item);
};

export const findItemIds = (
  name: string,
  searchLists: boolean = false,
): string[] => {
  const items = PersistenceService.readAll();
  const listSuffix = '.list';
  const unique = array => [...new Set(array)];

  return unique(
    Object.keys(items)
      .filter(id => id.startsWith(`${name}.`))
      .map(id =>
        searchLists && id.endsWith(listSuffix)
          ? id.slice(0, -listSuffix.length)
          : id,
      ),
  );
};
