import React, { PropTypes } from 'react';

function DocumentDetailItem({ title, children }) {
  return (
    <div className="list-group-item">
      {title && <p className="list-group-item-text">{title}</p>}
      <h4 className="list-group-item-heading">
        {children}
      </h4>
    </div>
  );
}

DocumentDetailItem.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default DocumentDetailItem;
