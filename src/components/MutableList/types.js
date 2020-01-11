// @flow
import { MutableListItemMode } from './enums';

export type MutableListElement = {
  id: string,
  status: string,
  data: ?any,
};

export type MutableListItemType = {
  id: string,
  data: any,
};

export type MutableListItemModeType = $Values<typeof MutableListItemMode>;
