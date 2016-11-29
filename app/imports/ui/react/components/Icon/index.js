import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

const sizeMap = {
  1: '',
  2: 'lg',
  3: 'x2',
  4: 'x3',
  5: 'x4',
  6: 'x5',
};

const marginMap = {
  left: 'margin-left',
  right: 'margin-right',
};

const Icon = ({ margin, size = 1, className, names }) => {
  const sizeCx = sizeMap[size] && `fa-${sizeMap[size]}`;
  const marginCx = margin && marginMap[margin];
  const namesCx = names.split(' ').map(name => `fa-${name}`);
  return (
    <i className={cx('fa', ...namesCx, sizeCx, marginCx, className)} />
  );
};

Icon.propTypes = {
  names: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(_.keys(marginMap)),
  size: PropTypes.oneOf(_.keys(sizeMap)),
  className: PropTypes.string,
};

export default Icon;
