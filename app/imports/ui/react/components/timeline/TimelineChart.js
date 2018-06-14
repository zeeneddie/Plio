import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { prop } from 'ramda';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { VictoryChart, VictoryAxis } from 'victory';
import { debounceHandlers } from '../../helpers';
import { getScaleDates, getTimelineListProps } from './helpers';

import TimelineAxis from './TimelineAxis';

const TimelineChartWrapper = styled.div`
  position: relative;
`;

const CurrentDateLine = styled.div.attrs({
  style: ({ partOfPastTime }) => ({
    left: `calc(${partOfPastTime * 100}% + 10px)`,
  }),
})`
  height: 100%;
  width: 2px;
  position: absolute;
  background: #d5d5d5;
`;

const TimelineListWrapper = styled.div.attrs({
  style: ({ left, width }) => ({
    left: `${left || 0}%`,
    width: width ? `${width}%` : 'auto',
  }),
})`
  position: relative;
  white-space: nowrap;
  top: -7px;
  ${({ float }) => float && css`
    float: ${float};
    & > div {
      text-align: ${float};
    }
  `}
`;

const TimelineChartItemWrapper = styled.div`
  padding: 15px 8px;
`;

const enhance = compose(
  withState('width', 'setWidth', prop('maxWidth')),
  withHandlers({
    updateWidth: ({ maxWidth, width, setWidth }) => () => {
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth > maxWidth ? maxWidth : windowWidth;
      if (newWidth !== width) {
        setWidth(newWidth);
      }
    },
  }),
  debounceHandlers(['updateWidth'], 200),
  lifecycle({
    componentDidMount() {
      this.props.updateWidth();
      window.addEventListener('resize', this.props.updateWidth);
    },
    componentWillUnmount() {
      window.removeEventListener('resize', this.props.updateWidth);
    },
  }),
);

const TimelineChart = ({
  partOfPastTime,
  items,
  scaleType,
  renderLine,
  renderTimelineList,
  lineHeight,
  axisHeight,
  ...props
}) => {
  const scaleDates = getScaleDates(scaleType, partOfPastTime);
  const chartOptions = {
    scale: { x: 'time', y: 'linear' },
    domainPadding: { x: [8, 8] },
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    domain: {
      x: [scaleDates.start, scaleDates.end],
      y: [-1, items.length],
    },
    ...props,
  };

  return (
    <TimelineChartWrapper>
      <CurrentDateLine {...{ partOfPastTime }} />
      {items.map(item => (
        <TimelineChartItemWrapper key={item._id}>
          <VictoryChart
            height={lineHeight}
            {...chartOptions}
          >
            <VictoryAxis style={{ axis: { stroke: 'none' } }} />
            {renderLine({ item, scaleDates })}
          </VictoryChart>

          {renderTimelineList && (
            <TimelineListWrapper
              {...getTimelineListProps(scaleDates, item.startDate, item.endDate)}
            >
              {renderTimelineList({ item })}
            </TimelineListWrapper>
          )}
        </TimelineChartItemWrapper>
      ))}
      <TimelineAxis {...chartOptions} height={axisHeight} />
    </TimelineChartWrapper>
  );
};

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  items: PropTypes.array.isRequired,
  scaleType: PropTypes.number.isRequired,
  renderLine: PropTypes.func.isRequired,
  renderTimelineList: PropTypes.func,
  partOfPastTime: PropTypes.number,
  lineHeight: PropTypes.number,
  axisHeight: PropTypes.number,
};

export default enhance(TimelineChart);
