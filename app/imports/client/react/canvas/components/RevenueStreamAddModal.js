import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import RevenueStreamForm from './RevenueStreamForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const RevenueStreamAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_REVENUE_STREAM}>
        {createRevenueStream => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Revenue stream"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              notes: '',
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              notes,
              percentOfRevenue,
              percentOfProfit,
            }) => {
              const errors = [];

              if (!title) errors.push('title is required');
              if (!percentOfRevenue) errors.push('% of revenue is required');
              if (!percentOfProfit) errors.push('% of profit is required');

              if (errors.length) throw new Error(errors.join('\n'));

              return createRevenueStream({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                    percentOfRevenue,
                    percentOfProfit,
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <RevenueStreamForm {...{ organizationId }} />
          </EntityModal>
        )}
      </Mutation>
    )}
  </Query>
);

RevenueStreamAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default RevenueStreamAddModal;
