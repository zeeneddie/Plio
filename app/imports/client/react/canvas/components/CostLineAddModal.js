import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModalNext } from '../../components';
import CostLineForm from './CostLineForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateCostLine } from '../../../validation';

const CostLineAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_COST_LINE}>
        {createCostLine => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            label="Cost line"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              notes: '',
              percentOfTotalCost: null,
            }}
            onSubmit={(values) => {
              const errors = validateCostLine(values);

              if (errors) return errors;

              const {
                title,
                originator: { value: originatorId },
                color,
                percentOfTotalCost,
                notes,
              } = values;

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
          </EntityModalNext>
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
