import React, { PropTypes } from 'react';

import Subcard from '../../Subcard';

const SwitchView = ({ children, ...props }) => (
  <Subcard.SwitchView buttons={['New', 'Existing']} {...props}>
    {children}
  </Subcard.SwitchView>
);

SwitchView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default SwitchView;
