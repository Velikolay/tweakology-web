import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import './Common.css';
import './Color.css';

// Our inner form component. Will be wrapped with Formik({..})
const InnerColorForm = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-row">
          <label className="input-title">
            Alpha
          </label>
          <input
            id="alpha"
            placeholder=""
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={values.alpha}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.alpha && touched.alpha ? 'full-width-input error' : 'full-width-input'}
          />
        </div>
        <div className="form-row">
          <label className="input-title">
            Background
          </label>
          <input
            id="colorHex"
            placeholder=""
            type="text"
            value={values.colorHex}
            onChange={handleChange}
            onBlur={handleBlur}
            className="color-input"
          />
          <input
            type="color"
            value={values.colorHex}
            className="color-picker-input"
            onChange={event => props.setFieldValue("colorHex", event.target.value)}
          />
        </div>
      </div>
    </form>
  );
}

// class ComplexInnerColorForm extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       colorHex: props.values.colorHex,
//       alpha: props.values.alpha,
//       showModal: false
//     }
//     this.onColorChange = this.onColorChange.bind(this);
//     this.onShowColorPicker = this.onShowColorPicker.bind(this);
//   }

//   componentWillReceiveProps(nextProps) {
//     console.log(nextProps.values);
//     this.setState({
//       colorHex: nextProps.values.colorHex,
//       alpha: nextProps.values.alpha
//     });
//   }

//   onColorChange = colorHex => {
//     this.props.setFieldValue("colorHex", colorHex);
//   }

//   onShowColorPicker = () => {
//     this.setState({
//       showModal: true
//     });
//   }

//   onCloseColorPicker = () => {
//     this.setState({
//       showModal: false
//     });
//   }

//   render() {
//     const {
//       touched,
//       errors,
//       dirty,
//       isSubmitting,
//       handleChange,
//       handleBlur,
//       handleSubmit,
//       handleReset,
//     } = this.props;
//     return (
//       <form onSubmit={handleSubmit}>
//         <div className="color-form">
//           <div className="color-form-row">
//             <label className="color-title">
//               Alpha
//             </label>
//             <input
//               id="alpha"
//               placeholder=""
//               type="number"
//               min={0}
//               max={1}
//               step={0.05}
//               value={this.state.alpha}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.alpha && touched.alpha ? 'full-width-input error' : 'full-width-input'}
//             />
//           </div>
//           <div className="color-form-row">
//             <label className="color-title">
//               Background
//             </label>
//             <input
//               id="colorHex"
//               placeholder=""
//               type="text"
//               value={this.state.colorHex}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="color-input"
//             />
//             <button
//               type="button"
//               style={{ "background-color": this.state.colorHex}}
//               className="color-picker-button"
//               onClick={this.onShowColorPicker}
//             />
//           </div>
//         </div>
//         <ColorPickerModal isOpen={this.state.showModal} colorHex={this.state.colorHex} onColorChange={this.onColorChange} onRequestClose={this.onCloseColorPicker} />
//       </form>
//     );
//   }
// };

// class ColorPickerModal extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       showModal: props.isOpen
//     };
//   }

//   componentWillReceiveProps(nextProps) {
//     if (this.state.isOpen !== nextProps.isOpen) {
//       this.setState({
//         showModal: nextProps.isOpen
//       });
//     }
//   }

//   render () {
//     return (
//       <Modal
//         isOpen={this.state.showModal}
//         onRequestClose={this.props.onRequestClose}
//         style={{
//           overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(255, 255, 255, 0)'
//           },
//           content: {
//             display: 'inline-block',
//             position: 'relative',
//             border: '1px solid #ccc',
//             background: '#fff',
//             overflow: 'auto',
//             WebkitOverflowScrolling: 'touch',
//             borderRadius: '4px',
//             outline: 'none',
//             padding: 0
//           }
//         }}
//       >
//         <SketchPicker
//           color={this.props.colorHex}
//           onChangeComplete={(color, event) => {
//             this.props.onColorChange(color.hex);
//           }}
//         />
//       </Modal>
//     );
//   }
// }

const EnhancedColorForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({ alpha: props.alpha, colorHex: props.colorHex }),
  // validationSchema: Yup.object().shape({
  //   email: Yup.string()
  //     .email('Invalid email address')
  //     .required('Email is required!'),
  // }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'ColorForm', // helps with React DevTools
})(InnerColorForm);

const ColorForm = props => {
  return <EnhancedColorForm {...props} />
}

export default ColorForm;