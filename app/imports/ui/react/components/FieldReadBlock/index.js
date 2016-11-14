import React from 'react';

import propTypes from './propTypes';

const FieldReadBlock = ({ label, children }) => (
  <div>
    <div className="card-block card-subheading">
      <h4 className="card-title">{label}</h4>
    </div>

    <div className="list-group">
      {children}
    </div>
  </div>
);

FieldReadBlock.propTypes = propTypes;

export default FieldReadBlock;
