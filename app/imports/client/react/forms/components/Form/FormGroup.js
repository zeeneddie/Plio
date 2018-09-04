import PropTypes from 'prop-types';
import React from 'react';

const FormGroup = ({ children }) => (
  <div className="form-group row">
    {children}
  </div>
);

FormGroup.propTypes = {
  children: PropTypes.node,
};

export default FormGroup;
