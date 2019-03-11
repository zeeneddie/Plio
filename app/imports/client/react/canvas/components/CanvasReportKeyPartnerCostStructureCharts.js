import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'reactstrap';

import { getKeyPartnerChartData, getDoughnutChartData } from '../helpers';
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
        <Col xs="4" offset={{ xs: 1 }}>
          <CanvasReportCriticalityChart
            title="Key partners"
            subtitle="criticality vs spend"
            data={getKeyPartnerChartData(keyPartners)}
          />
        </Col>
        <Col xs="4" offset={{ xs: 1 }}>
          <CanvasReportDoughnutChart
            title="Cost structure"
            subtitle="% of total costs"
            icon="tags"
            data={getDoughnutChartData('percentOfTotalCost', costLines)}
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
