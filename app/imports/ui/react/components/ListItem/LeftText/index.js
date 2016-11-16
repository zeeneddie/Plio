import React from 'react';
import cx from 'classnames';

const ListItemLeftText = ({ className, children }) => (
  <p className={cx(className, 'list-group-item-text pull-left')}>
    {children}
  </p>
);

export default ListItemLeftText;
