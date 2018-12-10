import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import CustomerInsightsSubcard from './CustomerInsightsSubcard';
import CanvasSubcards from './CanvasSubcards';

const CustomerSegmentSubcards = ({
  organizationId,
  customerSegment,
  onChange,
  user,
  refetchQueries,
}) => (
  <Fragment>
    <CustomerInsightsSubcard
      {...{ organizationId }}
      needs={customerSegment.needs || []}
      wants={customerSegment.wants || []}
      documentId={customerSegment._id}
      matchedTo={customerSegment.matchedTo}
      documentType={CanvasTypes.CUSTOMER_SEGMENT}
    />
    <CanvasSubcards
      {...{
        organizationId,
        onChange,
        user,
        refetchQueries,
      }}
      section={customerSegment}
      documentType={CanvasTypes.CUSTOMER_SEGMENT}
      slingshotDirective={AWSDirectives.CUSTOMER_SEGMENT_FILES}
    />
  </Fragment>
);

CustomerSegmentSubcards.propTypes = {
  customerSegment: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default CustomerSegmentSubcards;
