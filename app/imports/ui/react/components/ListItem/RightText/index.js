import React from 'react';
import cx from 'classnames';

import propTypes from '../propTypes';

const ListItemRightText = ({ className, children }) => (
  <p className={cx(className, 'list-group-item-text pull-right')}>
    {children}
  </p>
);

ListItemRightText.propTypes = propTypes;

export default ListItemRightText;
