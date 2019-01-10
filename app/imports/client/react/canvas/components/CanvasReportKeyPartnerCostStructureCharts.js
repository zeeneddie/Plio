import React from 'react';
import PropTypes from 'prop-types';
import { pluck } from 'ramda';
import { Container, Row } from 'reactstrap';

import { getKeyPartnerChartData } from '../helpers';
import { Col } from '../../components';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportDoughnutChart from './CanvasReportDoughnutChart';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';
import CanvasReportCriticalityChart from './CanvasReportCriticalityChart';

const CanvasReportKeyPartnerCostStructureCharts = ({ keyPartners, costLines }) => (
  <CanvasReportSection className="canvas-charts">
    <CanvasReportSectionHeading>Canvas charts</CanvasReportSectionHeading>
    <hr />
    <Container fluid>
      <Row>
        <Col xs="4" offset={{ xs: 2 }}>
          <CanvasReportCriticalityChart
            title="Key partners"
            subtitle="% of market"
            data={getKeyPartnerChartData(keyPartners)}
          />
        </Col>
        <Col xs="4">
          <CanvasReportDoughnutChart
            title="Cost structure"
            subtitle="% of total costs"
            icon="tags"
            data={pluck('percentOfTotalCost', costLines)}
            labels={pluck('title', costLines)}
          />
        </Col>
      </Row>
    </Container>
  </CanvasReportSection>
);

CanvasReportKeyPartnerCostStructureCharts.propTypes = {
  keyPartners: PropTypes.array.isRequired,
  costLines: PropTypes.array.isRequired,
};

export default CanvasReportKeyPartnerCostStructureCharts;
