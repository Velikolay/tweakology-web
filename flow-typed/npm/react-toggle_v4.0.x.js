// flow-typed signature: c5dcce971a3221a20b10cff5eb45952b
// flow-typed version: c6154227d1/react-toggle_v4.0.x/flow_>=v0.104.x

declare module "react-toggle" {
  declare type Icons = {
    checked?: React$Node,
    unchecked?: React$Node,
    ...
  };

  declare type Props = {
    checked?: boolean,
    defaultChecked?: boolean,
    onChange?: (e: SyntheticInputEvent<*>) => void,
    onFocus?: (e: SyntheticInputEvent<*>) => void,
    onBlur?: (e: SyntheticInputEvent<*>) => void,
    name?: string,
    value?: string,
    id?: string,
    icons?: Icons | boolean,
    "aria-labelledby"?: string,
    "aria-label"?: string,
    disabled?: boolean,
    ...
  };

  declare export default class Toggle extends React$Component<Props> {}
}
