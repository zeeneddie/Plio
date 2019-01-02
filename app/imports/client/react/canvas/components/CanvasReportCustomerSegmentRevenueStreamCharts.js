import React from 'react';
import PropTypes from 'prop-types';
import { pluck } from 'ramda';
import { Row, Container } from 'reactstrap';

import { Col } from '../../components';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportDoughnutChart from './CanvasReportDoughnutChart';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';

const getLabels = pluck('title');

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
            data={pluck('percentOfMarketSize', customerSegments)}
            labels={getLabels(customerSegments)}
          />
        </Col>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Revenue streams"
            subtitle="% of revenue"
            icon="usd"
            data={pluck('percentOfRevenue', revenueStreams)}
            labels={getLabels(revenueStreams)}
          />
        </Col>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Profit streams"
            subtitle="% of profit"
            icon="usd"
            data={pluck('percentOfProfit', revenueStreams)}
            labels={getLabels(revenueStreams)}
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
