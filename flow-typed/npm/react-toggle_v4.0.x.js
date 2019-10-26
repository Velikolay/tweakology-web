// flow-typed signature: 63293e36a89a9b6543721b4122e561c5
// flow-typed version: c6154227d1/react-toggle_v4.0.x/flow_>=v0.54.x <=v0.103.x

declare module "react-toggle" {
  declare type Icons = {
    checked?: React$Node,
    unchecked?: React$Node
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
    disabled?: boolean
  };

  declare export default class Toggle extends React$Component<Props> {}
}
