import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const FormLabel = ({ children, colSm, colXs }) => (
  <label
    className={cx(
      'form-control-label',
      colSm && `col-sm-${colSm}`,
      colXs && `col-xs-${colXs}`,
    )}
  >
    {children}
  </label>
);

FormLabel.propTypes = {
  children: PropTypes.node,
  colSm: PropTypes.number,
  colXs: PropTypes.number,
};

export default FormLabel;
