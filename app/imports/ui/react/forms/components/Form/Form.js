import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { compose, withContext, withState, defaultProps, lifecycle } from 'recompose';
import serialize from 'form-serialize';
import get from 'lodash.get';
import set from 'lodash.set';

import FormGroup from './FormGroup';
import FormLabel from './FormLabel';
import SubForm from './SubForm';

const enhance = compose(
  defaultProps({ autosave: false }),
  withState('formData', 'setFormData', props => props.initialFormData || {}),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      // update form data if document was changed in Minimongo
      const shoudSetNewFormData = _.every([
        !_.isEqual(nextProps.initialFormData, this.props.formData),
        !_.isEqual(nextProps.initialFormData, this.props.initialFormData),
      ]);

      if (shoudSetNewFormData) {
        this.props.setFormData(nextProps.initialFormData);
      }
    },
  }),
  withContext(
    {
      changeField: PropTypes.func,
      getField: PropTypes.func,
    },
    props => ({
      changeField(fieldName, newFieldValue, shouldSave = true, ...other) {
        const newFormData = set({ ...props.formData }, fieldName, newFieldValue);
        props.setFormData(newFormData);

        if (shouldSave && props.autosave && _.isFunction(props.onFormChange)) {
          props.onFormChange(fieldName, newFieldValue, ...other);
        }
      },
      getField(fieldName) {
        return get(props.formData, fieldName);
      },
    }),
  ),
);
const Form = enhance(({ children, onSubmit }) => {
  let formRef;

  const submitWrap = (e) => {
    e.preventDefault();
    const formData = serialize(formRef, { hash: true, empty: true });
    _.isFunction(onSubmit) && onSubmit(formData);
  };

  return (
    <form ref={(form) => { formRef = form; }} onSubmit={submitWrap}>
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
Form.SubForm = SubForm;

export default Form;
