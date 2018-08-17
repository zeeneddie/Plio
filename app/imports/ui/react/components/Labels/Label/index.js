import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { MarginMap } from '../../../../../api/constants';

const Label = ({
  names = 'default', className, margin, children,
}) => {
  const namesCx = names.split(' ').map(name => `label-${name}`);
  const marginCx = margin && MarginMap[margin];
  return (
    <span className={cx('label', ...namesCx, marginCx, className)}>
      {children}
    </span>
  );
};

Label.propTypes = {
  names: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  margin: PropTypes.oneOf(Object.keys(MarginMap)),
};

export default Label;
