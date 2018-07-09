import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { CanvasStyles } from '../constants';
import { Icon } from '../../components';

const SquareIcon = props => <Icon {...props} name="square" />;

const CanvasSquareIcon = styled(SquareIcon)`
  float: left;
  margin-right: 8px;
  margin-top: 4px;

  ${is('yellow')`
    color: ${CanvasStyles.color.yellow};
  `}

  ${is('magenta')`
    color: ${CanvasStyles.color.magenta};
  `}

  ${is('pink')`
    color: ${CanvasStyles.color.pink};
  `}
`;

export default CanvasSquareIcon;
