import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { prop } from 'ramda';

import { Icon } from '../../components';

const SquareIcon = props => <Icon {...props} name="square" />;

const CanvasSquareIcon = styled(SquareIcon)`
  float: left;
  margin-right: 8px;
  margin-top: 4px;
  color: ${prop('color')};
`;

CanvasSquareIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default CanvasSquareIcon;
