import React, { PropTypes } from 'react';
import cx from 'classnames';

const Field = ({ label, className, children }) => (
  <div className="list-group-item">
    {label && (
      <p className="list-group-item-text">{label}</p>
    )}
    <h4 className={cx(className, 'list-group-item-heading')}>
      {children}
    </h4>
  </div>
);

Field.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Field;
