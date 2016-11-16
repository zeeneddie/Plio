import React from 'react';
import cx from 'classnames';

import propTypes from '../propTypes';

const ListItemLeftText = ({ className, children }) => (
  <p className={cx(className, 'list-group-item-text pull-left')}>
    {children}
  </p>
);

ListItemLeftText.propTypes = propTypes;

export default ListItemLeftText;
