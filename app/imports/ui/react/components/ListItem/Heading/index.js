import React from 'react';
import cx from 'classnames';

import propTypes from '../propTypes';

const ListItemHeading = ({ className, children }) => (
  <div className="flexbox-row">
    <h4 className={cx(className, 'list-group-item-heading pull-xs-left')}>
      {children}
    </h4>
  </div>
);

ListItemHeading.propTypes = propTypes;

export default ListItemHeading;
