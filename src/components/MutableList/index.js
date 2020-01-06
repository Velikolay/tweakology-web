// @flow
import MutableList from './MutableList';
import PersistenceService from '../../services/persistence';

export const readList = (id: string): any[] => {
  return PersistenceService.read(`${id}.list`);
};

export const readItem = (id: string): any => {
  return PersistenceService.read(id, 'values');
};

export const findItems = (kind: string): string[] => {
  const items = PersistenceService.readAll();
  return Object.keys(items).filter(
    id => id.startsWith(`${kind}.`) && !id.endsWith('.list'),
  );
};

export default MutableList;
