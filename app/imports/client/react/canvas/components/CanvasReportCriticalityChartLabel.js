import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CanvasReportChartLabel from './CanvasReportChartLabel';

const LabelValue = styled.span`
  flex: 0 0 130px;
  & > span {
    width: 65px;
    text-align: right;
    display: inline-block;
  }
`;

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CanvasReportCriticalityChartLabel = ({
  label,
  color,
  x,
  y,
}) => (
  <CanvasReportChartLabel {...{ color }}>
    <Title>{label}</Title>
    <LabelValue className="text-muted">
      <span>{y}</span>
      <span>{x}</span>
    </LabelValue>
  </CanvasReportChartLabel>
);

CanvasReportCriticalityChartLabel.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
};

export default CanvasReportCriticalityChartLabel;
