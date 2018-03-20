import PropTypes from 'prop-types';
import React from 'react';
import { prop } from 'ramda';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { VictoryChart } from 'victory';
import { debounceHandlers } from '../../helpers';

import TimelineAxis from './TimelineAxis';

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
    componentWillMount() {
      window.removeEventListener('resize', this.props.updateWidth);
    },
  }),
);

const TimelineChart = ({
  scale = { x: 'time', y: 'linear' },
  domainPadding = { x: [10, 10] },
  padding = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  children,
  ...props
}) => (
  <VictoryChart
    {...{
      scale,
      domainPadding,
      padding,
      ...props,
    }}
  >
    {TimelineAxis()}
    {children}
  </VictoryChart>
);

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  children: PropTypes.node.isRequired,
};

export default enhance(TimelineChart);
