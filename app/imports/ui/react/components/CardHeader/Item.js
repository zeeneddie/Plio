import React, { PropTypes } from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

import { PullMap } from '/imports/api/constants';

export const Item = ({ children, className, pull }) => (
  <div className={cx(PullMap[pull], className)}>
    {children}
  </div>
);

Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  pull: PropTypes.oneOf(_.keys(PullMap)),
};
