import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import CustomerSegmentForm from './CustomerSegmentForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const CustomerSegmentAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_CUSTOMER_SEGMENT}>
        {createCustomerSegment => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Customer segment"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              matchedTo: { label: 'None', value: undefined },
              percentOfMarketSize: null,
              notes: '',
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              notes,
              matchedTo,
              percentOfMarketSize,
            }) => {
              const errors = [];

              if (!title) errors.push('title is required');
              if (!percentOfMarketSize) errors.push('% of market size is required');

              if (errors.length) throw new Error(errors.join('\n'));

              return createCustomerSegment({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                    percentOfMarketSize,
                    matchedTo: matchedTo.value ? {
                      documentId: matchedTo.value,
                      documentType: CanvasTypes.VALUE_PROPOSITION,
                    } : undefined,
                  },
                },
                refetchQueries: [
                  { query: Queries.CUSTOMER_SEGMENT_LIST, variables: { organizationId } },
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <CustomerSegmentForm {...{ organizationId }} />
          </EntityModal>
        )}
      </Mutation>
    )}
  </Query>
);

CustomerSegmentAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default CustomerSegmentAddModal;
