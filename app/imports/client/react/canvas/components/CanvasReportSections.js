import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, values, length } from 'ramda';
import { concatAll } from 'plio-util';

import CanvasReportItems from './CanvasReportItems';
import CanvasReportCustomerInsights from './CanvasReportCustomerInsights';
import CanvasReportValueComponents from './CanvasReportValueComponents';
import CanvasReportOperationalElements from './CanvasReportOperationalElements';
import CanvasReportCustomerSegmentRevenueStreamCharts from
  './CanvasReportCustomerSegmentRevenueStreamCharts';
import CanvasReportKeyPartnerCostStructureCharts from './CanvasReportKeyPartnerCostStructureCharts';

const getCanvasItemsCount = compose(
  length,
  concatAll,
  values,
);

const CanvasReportSections = ({ sections }) => {
  const itemsCount = getCanvasItemsCount(sections);
  return (
    <Fragment>
      <CanvasReportItems {...{ itemsCount, ...sections }} />
      <CanvasReportCustomerSegmentRevenueStreamCharts
        customerSegments={sections.customerSegments}
        revenueStreams={sections.revenueStreams}
      />
      <CanvasReportKeyPartnerCostStructureCharts
        keyPartners={sections.keyPartners}
        costLines={sections.costLines}
      />
      <CanvasReportCustomerInsights customerSegments={sections.customerSegments} />
      <CanvasReportValueComponents valuePropositions={sections.valuePropositions} />
      <CanvasReportOperationalElements {...sections} />
    </Fragment>
  );
};

CanvasReportSections.propTypes = {
  sections: PropTypes.object.isRequired,
};

export default CanvasReportSections;
