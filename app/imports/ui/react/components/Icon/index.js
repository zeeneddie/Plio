import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

import { MarginMap } from '/imports/api/constants';

const sizeMap = {
  1: '',
  2: 'lg',
  3: '2x',
  4: '3x',
  5: '4x',
  6: '5x',
};

const Icon = ({ margin, size = 1, className, names }) => {
  const sizeCx = sizeMap[size] && `fa-${sizeMap[size]}`;
  const marginCx = margin && MarginMap[margin];
  const namesCx = names.split(' ').map(name => `fa-${name}`);
  return (
    <i className={cx('fa', ...namesCx, sizeCx, marginCx, className)} />
  );
};

Icon.propTypes = {
  names: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(_.keys(MarginMap)),
  size: PropTypes.oneOf(_.keys(sizeMap)),
  className: PropTypes.string,
};

export default Icon;
