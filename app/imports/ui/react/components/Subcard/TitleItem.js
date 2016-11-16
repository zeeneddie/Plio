import React, { PropTypes } from 'react';
import cx from 'classnames';
import { PullMap } from '/imports/api/constants';
import { _ } from 'meteor/underscore';

const TitleItem = ({ children, pull, muted = false }) => (
  <h4 className={cx('card-title', PullMap[pull], { 'text-muted': muted })}>
    {children}
  </h4>
);

TitleItem.propTypes = {
  children: PropTypes.node,
  pull: PropTypes.oneOf(_.keys(PullMap)),
  muted: PropTypes.bool,
};

export default TitleItem;
