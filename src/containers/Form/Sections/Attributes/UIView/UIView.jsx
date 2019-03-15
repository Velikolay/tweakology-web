import { withFormik } from 'formik';

import { withFormikContextProvider } from '../../../../../contexts/Form/FormikContext';

import UIViewAttributesPresenter from '../../../../../components/Form/Sections/Attributes/UIView/UIView';

import { withFormikShell } from '../../../FormikShell';
import UIViewTransformer from '../../../../../Transformers/UIView';

const UIViewAttributes = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UIViewTransformer.fromPayload(props.formData),
  displayName: 'UIViewAttributes',
})(withFormikContextProvider(withFormikShell(UIViewAttributesPresenter)));

export default UIViewAttributes;
