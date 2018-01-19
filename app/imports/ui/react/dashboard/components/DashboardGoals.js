// import PropTypes from 'prop-types';
import React from 'react';
import {
  VictoryChart,
  // VictorySharedEvents,
  // VictoryZoomContainer,
  VictoryAxis,
  // VictoryClipContainer,
  VictoryLine,
} from 'victory';

const DashboardGoals = ({ data: { loading, goals } }) => !loading && (
  <VictoryChart
    standalone
    width={1140}
    height={200}
    scale={{ x: 'time' }}
    domainPadding={{
      x: [20, 20],
    }}
    domain={{
      x: [
        new Date('01 January 2018'),
        new Date('01 January 2019'),
      ],
      y: [
        -1,
        goals.length,
      ],
    }}
    // containerComponent={<VictoryZoomContainer dimension="x" />}
    padding={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <VictoryAxis />
    <VictoryLine
      data={[{
        x: new Date(),
        y: 0,
        label: 'today',
      }, {
        x: new Date(),
        y: 200,
      }]}
    />
    {/* {goals.map(({ _id }) => (
      <VictoryLine
        key={_id}
        animate={{ duration: 500 }}
      />
    ))} */}
  </VictoryChart>
);

DashboardGoals.propTypes = {};

export default DashboardGoals;
