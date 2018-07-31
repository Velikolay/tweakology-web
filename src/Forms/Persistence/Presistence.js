import { Component } from 'react';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';


class Persist extends Component {
  static defaultProps = {
    debounce: 300,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setForm(nextProps);
    } else {
      if (!isEqual(nextProps.formik, this.props.formik)) {
        // console.log('Form saving..');
        this.saveForm(nextProps.formik);
      } else {
        // console.log('Form wont save');
      }
    }
  }

  componentDidMount() {
    this.setForm(this.props);
  }

  saveForm = debounce(data => {
    // BUG!!
    window.localStorage.setItem(this.props.name, JSON.stringify(data));
    // console.log('Form saved');
  }, this.props.debounce);

  setForm = props => {
    // console.log('Form loading..');
    const maybeState = window.localStorage.getItem(props.name);
    
    let modifiedProps = props.formik;
    if (maybeState && maybeState !== null) {
      modifiedProps = JSON.parse(
        maybeState
      );
    }

    const { values, errors, touched, isSubmitting, status } = modifiedProps; 

    const { formik } = this.props;
    if (formik) {
      if (values) {
        formik.setValues(values);
      }

      if (errors) {
        formik.setErrors(errors);
      }

      if (touched) {
        formik.setTouched(touched);
      }

      if (isSubmitting) {
        formik.setSubmitting(isSubmitting);
      }

      if (status) {
        formik.setStatus(status);
      }
      // console.log('Form Loaded');
    }
  }

  render() {
    return null;
  }
}

const readPersistedValues = (item) => {
  const maybeState = window.localStorage.getItem(item);
  return maybeState ? JSON.parse(maybeState).values : null;
}

export { Persist, readPersistedValues };