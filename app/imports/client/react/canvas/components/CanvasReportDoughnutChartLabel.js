import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CanvasReportChartLabel from './CanvasReportChartLabel';

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
`;

const CanvasReportDoughnutChartLabel = ({ label, color, percent }) => (
  <CanvasReportChartLabel {...{ color }}>
    <Title>{label}</Title>
    <span className="text-muted">{percent || 0}%</span>
  </CanvasReportChartLabel>
);

CanvasReportDoughnutChartLabel.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percent: PropTypes.number,
};

export default CanvasReportDoughnutChartLabel;
