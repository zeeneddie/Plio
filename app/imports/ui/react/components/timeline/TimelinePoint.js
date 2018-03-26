import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { VictoryLabel, Point } from 'victory';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';
import { Popover } from 'reactstrap';
import { omit } from 'ramda';
import { getTitleDX, pathHelpers } from './helpers';
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
    symbol,
    datum: {
      x,
      title,
      isStart,
      isEnd,
      startDate,
      renderPopover,
      titleAnchor,
    },
  }) => {
    const getPath = pathHelpers[symbol];
    return {
      titleAnchor,
      renderPopover,
      getPath,
      dateLabel: (isStart || isEnd) && moment(title).format('D MMM YYYY'),
      pointId: `point-${id}-${index}`,
      isLabel: isStart || scale.x(x) - scale.x(startDate) > SHORT_LINE_WIDTH,
      dx: getTitleDX(titleAnchor),
      symbol: !getPath ? symbol : null,
    };
  }),
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
      <foreignObject {...omit(['getPath'], props)}>
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
