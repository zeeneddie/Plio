import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Pull } from '../../components';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportColumnList from './CanvasReportColumnList';
import CanvasReportCustomerSegmentColumnItem from './CanvasReportCustomerSegmentColumnItem';

const CanvasReportCustomerInsights = ({ customerSegments }) => !!customerSegments.length && (
  <CanvasReportSection className="customer-insights">
    <CanvasReportSectionHeading>
      Customer insights
      <Pull right>
        <Icon size="2" name="smile-o" />
      </Pull>
    </CanvasReportSectionHeading>
    <CanvasReportColumnList
      items={customerSegments}
      renderItem={CanvasReportCustomerSegmentColumnItem}
    />
  </CanvasReportSection>
);

CanvasReportCustomerInsights.propTypes = {
  customerSegments: PropTypes.array.isRequired,
};

export default CanvasReportCustomerInsights;
