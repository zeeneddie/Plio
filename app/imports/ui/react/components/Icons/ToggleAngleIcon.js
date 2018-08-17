import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

const StyledIcon = styled(Icon)`
  transition: all .4s ease;
  transform: ${({ isOpen }) => isOpen ? 'none' : 'rotate(-90deg)'};
`;

StyledIcon.displayName = 'ToggleAngleIcon';

const ToggleAngleIcon = ({ isOpen, ...props }) => (
  <StyledIcon name="angle-down" {...{ isOpen, ...props }} />
);

ToggleAngleIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default ToggleAngleIcon;
