import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Query as Queries } from '../../../graphql';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import CustomerInsightsSubcard from './CustomerInsightsSubcard';
import CanvasSubcards from './CanvasSubcards';

const CustomerSegmentSubcards = ({
  organizationId,
  customerSegment,
  onChange,
  user,
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
      {...{ organizationId, onChange, user }}
      section={customerSegment}
      refetchQuery={Queries.CUSTOMER_SEGMENT_CARD}
      documentType={CanvasTypes.CUSTOMER_SEGMENT}
      slingshotDirective={AWSDirectives.CUSTOMER_SEGMENT_FILES}
    />
  </Fragment>
);

CustomerSegmentSubcards.propTypes = {
  customerSegment: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default CustomerSegmentSubcards;
