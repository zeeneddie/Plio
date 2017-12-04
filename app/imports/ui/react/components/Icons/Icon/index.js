import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

import { FaSize } from '/imports/ui/react/components/Utility';
import { MarginMap } from '/imports/api/constants';

const Icon = ({
  margin, size = 1, sizePrefix = '', className, name,
}) => {
  const marginCx = margin && MarginMap[margin];
  const nameCx = name.split(' ').map(a => `fa-${a}`);
  return (
    <FaSize {...{ size, prefix: sizePrefix }}>
      <i className={cx('fa', ...nameCx, marginCx, className)} />
    </FaSize>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  margin: PropTypes.oneOf(_.keys(MarginMap)),
  size: FaSize.propTypes.size,
  sizePrefix: FaSize.propTypes.prefix,
  className: PropTypes.string,
};

export default Icon;
