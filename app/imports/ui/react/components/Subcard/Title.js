import React, { PropTypes } from 'react';

const Content = ({ children }) => (
  <div className="card-title">
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
