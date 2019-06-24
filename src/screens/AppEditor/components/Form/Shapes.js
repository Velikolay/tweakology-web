import PropTypes from 'prop-types';

const CGPointTypeObj = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

const CGSizeTypeObj = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const CGPoint = PropTypes.shape(CGPointTypeObj);

const CGSize = PropTypes.shape(CGSizeTypeObj);

const CGRect = PropTypes.shape({
  ...CGPointTypeObj,
  ...CGSizeTypeObj,
});

const UIColor = PropTypes.shape({
  hexValue: PropTypes.string.isRequired,
  alpha: PropTypes.number.isRequired,
});

const UIFont = PropTypes.shape({
  trait: PropTypes.number.isRequired,
  pointSize: PropTypes.number.isRequired,
  familyName: PropTypes.string.isRequired,
  fontName: PropTypes.string.isRequired,
});

const UIViewTypeObj = {
  frame: CGRect.isRequired,
  backgroundColor: UIColor.isRequired,
  contentMode: PropTypes.string.isRequired,
  semanticContentAttribute: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
};

const UIView = PropTypes.shape(UIViewTypeObj);

const UILabel = PropTypes.shape({
  ...UIViewTypeObj,
  font: UIFont.isRequired,
  textColor: UIColor.isRequired,
  text: PropTypes.string.isRequired,
  baselineAdjustment: PropTypes.number.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  lineBreakMode: PropTypes.number.isRequired,
  textAlignment: PropTypes.number.isRequired,
});

const UIButtonLabel = UILabel;

const UIButton = PropTypes.shape({
  ...UIViewTypeObj,
  title: UIButtonLabel.isRequired,
});

const UIImage = PropTypes.shape({
  src: PropTypes.string.isRequired,
});

const UIImageView = PropTypes.shape({
  ...UIViewTypeObj,
  image: UIImage.isRequired,
  highlightedImage: UIImage,
});

const UIScrollView = PropTypes.shape({
  ...UIViewTypeObj,
  contentOffset: CGPoint.isRequired,
  contentSize: CGSize.isRequired,
});

const NSLayoutConstraintItemAttribute = PropTypes.shape({
  item: PropTypes.shape({
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  }).isRequired,
  attribute: PropTypes.shape({
    value: PropTypes.string.isRequired,
    relativeToMargin: PropTypes.bool,
    respectLanguageDirection: PropTypes.bool,
  }),
});

const NSLayoutConstraint = PropTypes.shape({
  meta: PropTypes.shape({
    synced: PropTypes.bool,
    added: PropTypes.bool.isRequired,
  }).isRequired,
  first: NSLayoutConstraintItemAttribute.isRequired,
  second: NSLayoutConstraintItemAttribute,
  relation: PropTypes.string.isRequired,
  constant: PropTypes.number.isRequired,
  multiplier: PropTypes.number.isRequired,
  priority: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  itemOptions: PropTypes.any, // TODO: ideally should not be here
});

const formikTypeObjFrom = baseFormShape => ({
  initialValues: baseFormShape.isRequired,
  values: baseFormShape.isRequired,
  errors: PropTypes.oneOfType([baseFormShape, PropTypes.shape()]),
  touched: PropTypes.oneOfType([baseFormShape, PropTypes.shape()]),
  dirty: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isValidating: PropTypes.bool.isRequired,
  validateOnBlur: PropTypes.bool.isRequired,
  validateOnChange: PropTypes.bool.isRequired,
  submitCount: PropTypes.number.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  setFieldError: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFormikState: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  registerField: PropTypes.func.isRequired,
  unregisterField: PropTypes.func.isRequired,
});

export const FormDataShape = PropTypes.oneOfType([
  UIView,
  UILabel,
  UIButton,
  UIButtonLabel,
  UIImageView,
  UIScrollView,
  NSLayoutConstraint,
]);

export const AttributeFormikShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  eventHandler: PropTypes.func.isRequired,
  formData: FormDataShape.isRequired,
  ...formikTypeObjFrom(FormDataShape),
});
