import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Label } from 'reactstrap';

const FormLabel = ({ children, className, ...props }) => (
  <Label
    className={cx('form-control-label', className)}
    {...props}
  >
    {children}
  </Label>
);

FormLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default FormLabel;
