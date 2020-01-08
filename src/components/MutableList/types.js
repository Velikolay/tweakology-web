// @flow
import { MutableListItemMode } from './enums';

export type MutableListElement = {
  id: string,
  status: string,
  kind: ?string,
  values: ?any,
};

export type MutableListItemType = {
  id: string,
  kind?: string,
  values: any,
};

export type MutableListItemModeType = $Values<typeof MutableListItemMode>;
