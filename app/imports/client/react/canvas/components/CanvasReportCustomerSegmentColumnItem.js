import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportCustomerElementList from './CanvasReportCustomerElementList';

const CanvasReportCustomerSegmentColumnItem = ({
  index,
  title,
  matchedTo,
  needs = [],
  wants = [],
}) => (
  <Fragment>
    <CanvasReportHeader tag="h6">Customer segment {index + 1}:</CanvasReportHeader>
    <CanvasReportHeader tag="h5">{title}</CanvasReportHeader>
    {matchedTo && (
      <p className="text-muted">Matched to {matchedTo.title}</p>
    )}
    <Fragment>
      <CanvasReportHeader isEmpty={!needs.length} tag="h6">Needs:</CanvasReportHeader>
      <CanvasReportCustomerElementList isSimple items={needs} />
    </Fragment>
    <Fragment>
      <CanvasReportHeader isEmpty={!wants.length} tag="h6">Wants:</CanvasReportHeader>
      <CanvasReportCustomerElementList isSimple items={wants} />
    </Fragment>
  </Fragment>
);

CanvasReportCustomerSegmentColumnItem.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  matchedTo: PropTypes.object,
  needs: PropTypes.array,
  wants: PropTypes.array,
};

export default CanvasReportCustomerSegmentColumnItem;
