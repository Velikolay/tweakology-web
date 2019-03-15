import { withFormik } from 'formik';

import { withFormikContextProvider } from '../../../../../contexts/Form/FormikContext';

import UIButtonViewAttributesPresenter from '../../../../../components/Form/Sections/Attributes/UIButtonView/UIButtonView';

import { withFormikShell } from '../../../FormikShell';
import UIButtonTransformer from '../../../../../Transformers/UIButton';

const UIButtonViewAttributes = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props =>
    UIButtonTransformer.fromPayload(props.formData, props.device),
  displayName: 'UIButtonViewAttributes',
})(withFormikContextProvider(withFormikShell(UIButtonViewAttributesPresenter)));

export default UIButtonViewAttributes;
