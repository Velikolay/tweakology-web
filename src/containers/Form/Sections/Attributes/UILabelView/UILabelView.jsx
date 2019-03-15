import { withFormik } from 'formik';

import { withFormikContextProvider } from '../../../../../contexts/Form/FormikContext';

import UILabelViewAttributesPresenter from '../../../../../components/Form/Sections/Attributes/UILabelView/UILabelView';

import { withFormikShell } from '../../../FormikShell';
import UILabelTransformer from '../../../../../Transformers/UILabel';

const UILabelViewAttributes = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props =>
    UILabelTransformer.fromPayload(props.formData, props.device),
  displayName: 'UILabelViewAttributes',
})(withFormikContextProvider(withFormikShell(UILabelViewAttributesPresenter)));

export default UILabelViewAttributes;
