import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { VictoryLabel } from 'victory';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';
import { Popover } from 'reactstrap';
import { getTitleDX } from './helpers';
import Point from './Point';
import withStateToggle from '../../helpers/withStateToggle';

const SHORT_LINE_WIDTH = 125;
const StyledPopover = styled(Popover)`
  border-radius: 0;
  border: none;
  padding: 0;
  background-color: transparent;
  font-size: inherit;
  top: 10px !important;
`;

const enhance = compose(
  withStateToggle(false, 'isOpen', 'togglePopover'),
  withProps(({
    id,
    index,
    scale,
    datum: {
      x,
      title,
      isStart,
      isEnd,
      startDate,
      renderPopover,
      titleAnchor,
    },
  }) => ({
    titleAnchor,
    renderPopover,
    dateLabel: (isStart || isEnd) && moment(title).format('D MMM YYYY'),
    pointId: `point-${id}-${index}`,
    isLabel: isStart || scale.x(x) - scale.x(startDate) > SHORT_LINE_WIDTH,
    dx: getTitleDX(titleAnchor),
  })),
  onlyUpdateForKeys(['pointId', 'dateLabel', 'isOpen', 'isLabel', 'x']),
);

const TimelinePoint = ({
  dateLabel,
  pointId,
  isOpen,
  togglePopover,
  renderPopover,
  isLabel,
  titleAnchor,
  dx,
  ...props
}) => (
  <g>
    <g id={pointId} onClick={renderPopover && togglePopover}>
      <Point {...props} />
    </g>

    {isLabel && dateLabel && (
      <VictoryLabel
        {...{
          x: props.x,
          y: props.y,
          textAnchor: titleAnchor,
          dx,
          dy: 10,
          text: dateLabel,
          verticalAnchor: 'start',
          style: { fill: '#999' },
        }}
      />
    )}

    {renderPopover && (
      <foreignObject {...props}>
        <StyledPopover
          placement="bottom"
          isOpen={isOpen}
          target={pointId}
          toggle={togglePopover}
        >
          {isOpen && renderPopover({ togglePopover })}
        </StyledPopover>
      </foreignObject>
    )}
  </g>
);

TimelinePoint.propTypes = {
  renderPopover: PropTypes.func,
  isOpen: PropTypes.bool,
  pointId: PropTypes.string,
  togglePopover: PropTypes.func,
  dateLabel: PropTypes.string,
  titleAnchor: PropTypes.string,
  dx: PropTypes.number,
  isLabel: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default enhance(TimelinePoint);
