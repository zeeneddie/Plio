import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

import { FaSize } from '../../Utility';
import { MarginMap } from '../../../../../api/constants';

const Icon = ({
  margin,
  size = 1,
  sizePrefix = '',
  className,
  name,
  color,
}) => {
  const marginCx = margin && MarginMap[margin];
  const nameCx = name.split(' ').map(a => `fa-${a}`);
  const colorCx = color ? `text-${color}` : '';
  return (
    <FaSize {...{ size, prefix: sizePrefix }}>
      <i className={cx('fa', ...nameCx, marginCx, className, colorCx)} />
    </FaSize>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  margin: PropTypes.oneOf(_.keys(MarginMap)),
  size: FaSize.propTypes.size,
  sizePrefix: FaSize.propTypes.prefix,
  className: PropTypes.string,
  color: PropTypes.string,
};

export default Icon;
