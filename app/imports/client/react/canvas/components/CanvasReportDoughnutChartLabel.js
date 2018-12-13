import React from 'react';
import PropTypes from 'prop-types';
import CanvasReportChartLabel from './CanvasReportChartLabel';

const CanvasReportDoughnutChartLabel = ({ label, color, percent }) => (
  <CanvasReportChartLabel {...{ color }}>
    <span>{label}</span>
    <span className="text-muted">{percent || 0}%</span>
  </CanvasReportChartLabel>
);

CanvasReportDoughnutChartLabel.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percent: PropTypes.number,
};

export default CanvasReportDoughnutChartLabel;
