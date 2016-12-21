import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { compose, withContext, withState, defaultProps } from 'recompose';
import serialize from 'form-serialize';

import FormGroup from './FormGroup';
import FormLabel from './FormLabel';

const enhance = compose(
  defaultProps({ autosave: false }),
  withState('formData', 'setFormData', {}),
  withContext(
    {
      changeField: PropTypes.func,
      getField: PropTypes.func,
    },
    props => ({
      changeField(fieldName, newFieldValue) {
        if (!props.autosave) return;

        props.setFormData({
          ...props.formData,
          [fieldName]: newFieldValue,
        });

        _.isFunction(props.onFormChange) && props.onFormChange(fieldName, newFieldValue);
      },
      getField(fieldName) {
        return props.formData[fieldName];
      },
    }),
  )
);
const Form = enhance(({ children, onSubmit }) => {
  let formRef;

  const submitWrap = (e) => {
    e.preventDefault();
    const formData = serialize(formRef, { hash: true, empty: true });
    _.isFunction(onSubmit) && onSubmit(formData);
  };

  return (
    <form ref={form => { formRef = form; }} onSubmit={submitWrap}>
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
