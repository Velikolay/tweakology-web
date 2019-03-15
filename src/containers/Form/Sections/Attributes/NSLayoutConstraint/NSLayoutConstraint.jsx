import { withFormik } from 'formik';

import { withFormikContextProvider } from '../../../../../contexts/Form/FormikContext';

import NSLayoutConstraintAttributesPresenter from '../../../../../components/Form/Sections/Attributes/NSLayoutConstraint/NSLayoutConstraint';

import { withFormikShell } from '../../../FormikShell';

const NSLayoutConstraintAttributes = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => props.formData.constraint,
  displayName: 'NSLayoutConstraintAttributes',
})(
  withFormikContextProvider(
    withFormikShell(NSLayoutConstraintAttributesPresenter),
  ),
);

export default NSLayoutConstraintAttributes;
