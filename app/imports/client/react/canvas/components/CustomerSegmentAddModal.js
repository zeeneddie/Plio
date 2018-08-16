import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, convertDocumentOptions } from 'plio-util';

import { CanvasColors, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModalNext } from '../../components';
import CustomerSegmentForm from './CustomerSegmentForm';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { validateCustomerSegment } from '../../../validation';

const CustomerSegmentAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_CUSTOMER_SEGMENT}>
        {createCustomerSegment => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            label="Customer segment"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              matchedTo: OptionNone,
              percentOfMarketSize: null,
              notes: '',
            }}
            onSubmit={(values) => {
              const errors = validateCustomerSegment(values);

              if (errors) return errors;

              const {
                title,
                originator: { value: originatorId },
                color,
                percentOfMarketSize,
                notes,
                matchedTo,
              } = values;

              return createCustomerSegment({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                    percentOfMarketSize,
                    matchedTo: convertDocumentOptions({
                      documentType: CanvasTypes.VALUE_PROPOSITION,
                    }, matchedTo),
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <CustomerSegmentForm {...{ organizationId }} />
          </EntityModalNext>
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
