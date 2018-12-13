import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportCustomerElementList from './CanvasReportCustomerElementList';

const CanvasReportValuePropositionColumnItem = ({
  index,
  title,
  matchedTo,
  features = [],
  benefits = [],
}) => (
  <Fragment>
    <CanvasReportHeader tag="h6">Value proposition {index + 1}:</CanvasReportHeader>
    <CanvasReportHeader tag="h5">{title}</CanvasReportHeader>
    {matchedTo && (
      <p className="text-muted">Matched to {matchedTo.title}</p>
    )}
    <Fragment>
      <CanvasReportHeader isEmpty={!features.length} tag="h6">Features:</CanvasReportHeader>
      <CanvasReportCustomerElementList isSimple items={features} />
    </Fragment>
    <Fragment>
      <CanvasReportHeader isEmpty={!benefits.length} tag="h6">Benefits:</CanvasReportHeader>
      <CanvasReportCustomerElementList isSimple items={benefits} />
    </Fragment>
  </Fragment>
);

CanvasReportValuePropositionColumnItem.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  matchedTo: PropTypes.object,
  features: PropTypes.array,
  benefits: PropTypes.array,
};

export default CanvasReportValuePropositionColumnItem;
