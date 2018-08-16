import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModalNext } from '../../components';
import { validateRevenueStream } from '../../../validation';
import { WithState } from '../../helpers';
import RevenueStreamForm from './RevenueStreamForm';

const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'percentOfRevenue',
    'percentOfProfit',
    'notes',
  ]),
  pathOr({}, repeat('revenueStream', 2)),
);

const RevenueStreamEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.REVENUE_STREAM_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_REVENUE_STREAM}>
            {updateRevenueStream => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                loading={query.loading}
                error={query.error}
                label="Revenue stream"
                guidance="Revenue stream"
                validate={validateRevenueStream}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    percentOfRevenue,
                    percentOfProfit,
                    notes = '', // final form sends undefined value instead of an empty string
                  } = values;

                  return updateRevenueStream({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        percentOfRevenue,
                        percentOfProfit,
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
                  <RevenueStreamForm {...{ organizationId }} save={form.submit} />
                )}
              </EntityModalNext>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </WithState>
);

RevenueStreamEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(RevenueStreamEditModal);
