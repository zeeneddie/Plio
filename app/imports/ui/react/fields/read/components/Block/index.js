import React, { PropTypes } from 'react';

const CardBlock = ({ label, children }) => (
  <div>
    <div className="card-block card-subheading">
      <h4 className="card-title">{label}</h4>
    </div>

    <div className="list-group">
      {children}
    </div>
  </div>
);

CardBlock.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export default CardBlock;
