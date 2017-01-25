import React from 'react';
import cx from 'classnames';

import Icon from '../../Icon';

const VolumeMuteCross = ({ name, size = 1, ...other }) => (
  <Icon name={cx('times right', name)} {...{ size, ...other }} />
);

VolumeMuteCross.propTypes = Icon.propTypes;

export default VolumeMuteCross;
