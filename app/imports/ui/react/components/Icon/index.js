import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

const sizeMap = {
  1: 'lg',
  2: 'x2',
  3: 'x3',
  4: 'x4',
  5: 'x5',
};

const marginMap = {
  left: 'margin-left',
  right: 'margin-right',
};

const Icon = ({ name, margin, size = 1 }) => (
  <i className={cx('fa', `fa-${name}`, `fa-${sizeMap[size]}`, margin && marginMap[margin])} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(_.keys(marginMap)),
  size: PropTypes.oneOf(_.keys(sizeMap)),
};

export default Icon;

