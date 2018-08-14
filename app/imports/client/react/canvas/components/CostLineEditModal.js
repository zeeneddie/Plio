import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCostLine } from '../../../validation';
import { EntityModalNext } from '../../components';
import { WithState } from '../../helpers';
import CostLineForm from './CostLineForm';

const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'percentOfTotalCost',
    'notes',
  ]),
  pathOr({}, repeat('costLine', 2)),
);

const CostLineEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.COST_LINE_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_COST_LINE}>
            {updateCostLine => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                loading={query.loading}
                error={query.error}
                label="Cost line"
                guidance="Cost line"
                validate={validateCostLine}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    percentOfTotalCost,
                    notes = '', // final form sends undefined value instead of an empty string
                  } = values;

                  return updateCostLine({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        percentOfTotalCost,
                        originatorId: originator.value,
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }}
              >
                {({ form: { form } }) => (
                  <CostLineForm {...{ organizationId }} save={form.submit} />
                )}
              </EntityModalNext>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </WithState>
);

CostLineEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CostLineEditModal);
