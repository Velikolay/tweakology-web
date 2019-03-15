import { withFormik } from 'formik';

import { withFormikContextProvider } from '../../../../../contexts/Form/FormikContext';

import UIImageViewAttributesPresenter from '../../../../../components/Form/Sections/Attributes/UIImageView/UIImageView';

import { withFormikShell } from '../../../FormikShell';
import UIImageViewTransformer from '../../../../../Transformers/UIImageView';

const UIImageViewAttributes = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UIImageViewTransformer.fromPayload(props.formData),
  displayName: 'UIImageViewAttributes',
})(withFormikContextProvider(withFormikShell(UIImageViewAttributesPresenter)));

export default UIImageViewAttributes;
