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

export const findItemIds = (name: string): string[] => {
  const items = PersistenceService.readAll();
  return Object.keys(items).filter(
    id => id.startsWith(`${name}.`) && !id.endsWith('.list'),
  );
};
