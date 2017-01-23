import React, { PropTypes } from 'react';

function SectionItem({ title, children }) {
  return (
    <div className="list-group-item">
      {title && <p className="list-group-item-text">{title}</p>}
      <div className="list-group-item-heading">
        {children}
      </div>
    </div>
  );
}

SectionItem.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default SectionItem;
