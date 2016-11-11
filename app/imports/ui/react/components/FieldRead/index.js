import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const FieldRead = ({ label, className, children }) => (
  <div className="list-group-item">
    <p className="list-group-item-text">{label}</p>
    <h4 className={cx(className, 'list-group-item-heading')}>
      {children}
    </h4>
  </div>
);

FieldRead.propTypes = propTypes;

export default FieldRead;
