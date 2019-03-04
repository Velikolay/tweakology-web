import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { withFormikContext } from '../FormikContext';

class FormikObserver extends Component {
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
  formik: PropTypes.object.isRequired,
  debounce: PropTypes.number,
  onChange: PropTypes.func,
};

FormikObserver.defaultProps = {
  debounce: 16,
  onChange: () => null,
};

export default withFormikContext(FormikObserver);
