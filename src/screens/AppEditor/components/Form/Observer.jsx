import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { AttributeFormikShape } from './Shapes';
import { withFormikContext } from '../../../../contexts/FormikContext';

class FormikObserver extends Component {
  // eslint-disable-next-line react/destructuring-assignment
  onChange = debounce(next => this.props.onChange(next), this.props.debounce);

  componentWillReceiveProps(nextProps) {
    const { formik } = this.props;
    if (!isEqual(nextProps.formik, formik)) {
      this.onChange(nextProps.formik);
    }
  }

  render() {
    return null;
  }
}

FormikObserver.propTypes = {
  formik: AttributeFormikShape.isRequired,
  debounce: PropTypes.number,
  onChange: PropTypes.func,
};

FormikObserver.defaultProps = {
  debounce: 16,
  onChange: () => null,
};

export default withFormikContext(FormikObserver);
