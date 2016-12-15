import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { compose, withContext, withState, defaultProps } from 'recompose';

import FormGroup from './FormGroup';
import FormLabel from './FormLabel';

const enhance = compose(
  defaultProps({ autosave: false }),
  withState('formData', 'setFormData', {}),
  withContext(
    { changeField: PropTypes.func },
    props => ({
      changeField(fieldName, newFieldValue) {
        if (!props.autosave) return;

        props.setFormData({
          ...props.formData,
          [fieldName]: newFieldValue,
        });

        props.onFormChange(fieldName, newFieldValue);
      },
    }),
  )
);
const Form = enhance(({ children, onSubmit, formData }) => {
  const submitWrap = (e) => {
    e.preventDefault();

    _.isFunction(onSubmit) && onSubmit(formData);
  };

  return (
    <form onSubmit={submitWrap}>
      {children}
    </form>
  );
});

Form.propTypes = {
  autosave: PropTypes.bool,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  onFormChange: PropTypes.func,
};

Form.Group = FormGroup;
Form.Label = FormLabel;

export default Form;
