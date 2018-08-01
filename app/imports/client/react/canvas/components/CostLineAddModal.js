import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import CostLineForm from './CostLineForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const CostLineAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_COST_LINE}>
        {createCostLine => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Cost line"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              notes: '',
              percentOfTotalCost: null,
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              notes,
              percentOfTotalCost,
            }) => {
              if (!title) throw new Error('title is required');
              if (!percentOfTotalCost) throw new Error('% of total cost is required');

              return createCostLine({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    percentOfTotalCost,
                    color,
                    notes,
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <CostLineForm {...{ organizationId }} />
          </EntityModal>
        )}
      </Mutation>
    )}
  </Query>
);

CostLineAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default CostLineAddModal;
