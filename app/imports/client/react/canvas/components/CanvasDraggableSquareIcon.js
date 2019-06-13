import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { HoverSensor } from '../../helpers';
import CanvasSquareIcon from './CanvasSquareIcon';

const DragHandle = styled.span`
  cursor: row-resize;
  flex: 0 0 32px;
`;

const CanvasDraggableSquareIcon = props => (
  <HoverSensor>
    {({ isHovered, bind }) => (
      <DragHandle {...bind} className="drag-handle">
        <CanvasSquareIcon {...props} size="2" name={isHovered ? 'sort' : 'square'} />
      </DragHandle>
    )}
  </HoverSensor>
);

CanvasDraggableSquareIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default CanvasDraggableSquareIcon;
