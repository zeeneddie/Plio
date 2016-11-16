import React from 'react';

const ListItemHeading = ({ title, isNew, children }) => (
  <h4 className="list-group-item-heading pull-xs-left">
    <span>{title}</span>

    {isNew && (
      <span className="label label-primary">New</span>
    )}

    {children}
  </h4>
);

export default ListItemHeading;
