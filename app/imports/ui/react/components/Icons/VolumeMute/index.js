import React, { PropTypes } from 'react';

import IconStack from '../IconStack';
import Volume from './Volume';
import Cross from './Cross';

const VolumeMute = ({ children, ...other }) => (
  <IconStack {...other}>
    {children}
  </IconStack>
);

VolumeMute.propTypes = {
  children: PropTypes.node,
};

VolumeMute.Volume = Volume;
VolumeMute.Cross = Cross;

export default VolumeMute;
