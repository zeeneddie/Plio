import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { prop } from 'ramda';

import { Icon } from '../../components';
import { HoverSensor } from '../../helpers';

const DragHandle = styled.span`
  min-height: 30px;
  width: 32px;
  position: relative;
  cursor: row-resize;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  padding: 8px;
`;

const StyledIcon = styled(Icon)`
  height: 16px;
  width: 16px;
  padding: 2px;
  line-height: 12px;
  border-radius: 2px;
  display: block;
  text-align: center;
  color: ${prop('color')};
  transition: color .4s ease;
`;

const CanvasSquareIcon = props => (
  <HoverSensor>
    {({ isHovered, bind }) => (
      <DragHandle {...bind} className="drag-handle">
        <StyledIcon {...props} size="2" name={isHovered ? 'sort' : 'square'} />
      </DragHandle>
    )}
  </HoverSensor>
);

CanvasSquareIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default CanvasSquareIcon;
