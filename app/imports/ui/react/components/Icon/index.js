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

const Icon = ({ margin, size = 1, className, name }) => {
  const sizeCx = sizeMap[size] && `fa-${sizeMap[size]}`;
  const marginCx = margin && MarginMap[margin];
  const nameCx = name.split(' ').map(a => `fa-${a}`);
  return (
    <i className={cx('fa', ...nameCx, sizeCx, marginCx, className)} />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(_.keys(MarginMap)),
  size: PropTypes.oneOf(_.keys(sizeMap)),
  className: PropTypes.string,
};

export default Icon;
