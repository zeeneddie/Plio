import PropTypes from 'prop-types';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Field } from 'react-final-form';

const renderQuill = ({ input, onBlur, ...rest }) => (
  <Blaze
    {...{ ...input, ...rest }}
    template="Quill"
    onBlur={(html) => {
      input.onChange(html);
      if (onBlur) onBlur(html);
    }}
  />
);

renderQuill.propTypes = {
  input: PropTypes.object,
  onBlur: PropTypes.func,
};

const QuillField = props => (
  <Field
    {...props}
    component={renderQuill}
  />
);

export default QuillField;
