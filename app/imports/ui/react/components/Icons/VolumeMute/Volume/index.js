import React from 'react';
import cx from 'classnames';

import Icon from '../../Icon';

const VolumeMuteVolume = ({ name, size = 3, sizePrefix = 'stack', ...other }) => (
  <Icon name={cx('volume-off nudge-left', name)} {...{ size, sizePrefix, ...other }} />
);

VolumeMuteVolume.propTypes = Icon.propTypes;

export default VolumeMuteVolume;
