import React from 'react';
import cx from 'classnames';

const ListItemRightText = ({ className, children }) => (
  <p className={cx(className, 'list-group-item-text pull-right')}>
    {children}
  </p>
);

export default ListItemRightText;
