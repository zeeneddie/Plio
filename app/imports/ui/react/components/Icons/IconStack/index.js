import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { FaSize } from '../../Utility';

const IconStack = ({
  className,
  children,
  size,
  sizePrefix = 'stack',
  tag: Tag = 'span',
  ...other
}) => (
  <FaSize {...{ size, prefix: sizePrefix }}>
    <Tag className={cx('fa-stack', className)} {...other}>
      {children}
    </Tag>
  </FaSize>
);

IconStack.propTypes = {
  size: FaSize.propTypes.size,
  sizePrefix: FaSize.propTypes.prefix,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
};

export default IconStack;
