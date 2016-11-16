import React, { PropTypes } from 'react';

const Content = ({ children }) => (
  <div className="card-block-collapse collapse">
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
