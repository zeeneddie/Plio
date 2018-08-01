import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import CustomerSegmentAddModal from './CustomerSegmentAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const CustomerSegments = ({ organizationId }) => (
  <Query
    query={Queries.CUSTOMER_SEGMENTS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { customerSegments: { customerSegments = [] } } }) => (
      <CanvasBlock
        label="Customer segments"
        help={(
          <Fragment>
            <p>For whom are we creating value?</p>
            <p>Who are our most important customers?</p>
          </Fragment>
        )}
        items={customerSegments}
        renderModal={({ isOpen, toggle }) => (
          <CustomerSegmentAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

CustomerSegments.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerSegments);
