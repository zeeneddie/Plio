import React from 'react';
import PropTypes from 'prop-types';
import { Row, Container } from 'reactstrap';

import { Col } from '../../components';
import { getDoughnutChartData } from '../helpers';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportDoughnutChart from './CanvasReportDoughnutChart';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';

const CanvasReportCustomerSegmentRevenueStreamCharts = ({ customerSegments, revenueStreams }) => (
  <CanvasReportSection className="canvas-charts">
    <CanvasReportSectionHeading>Canvas charts</CanvasReportSectionHeading>
    <hr />
    <Container fluid>
      <Row>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Customer segments"
            subtitle="% of market"
            icon="smile-o"
            data={getDoughnutChartData('percentOfMarketSize', customerSegments)}
          />
        </Col>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Revenue streams"
            subtitle="% of revenue"
            icon="usd"
            data={getDoughnutChartData('percentOfRevenue', revenueStreams)}
          />
        </Col>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Profit streams"
            subtitle="% of profit"
            icon="usd"
            data={getDoughnutChartData('percentOfProfit', revenueStreams)}
          />
        </Col>
      </Row>
    </Container>
  </CanvasReportSection>
);

CanvasReportCustomerSegmentRevenueStreamCharts.propTypes = {
  customerSegments: PropTypes.array.isRequired,
  revenueStreams: PropTypes.array.isRequired,
};

export default CanvasReportCustomerSegmentRevenueStreamCharts;
