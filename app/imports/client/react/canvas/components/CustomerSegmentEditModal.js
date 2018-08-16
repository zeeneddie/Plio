import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getEntityOptions, getUserOptions, lenses, noop, convertDocumentOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCustomerSegment } from '../../../validation';
import { EntityModalNext } from '../../components';
import { WithState } from '../../helpers';
import CustomerSegmentForm from './CustomerSegmentForm';

const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'percentOfMarketSize',
    'matchedTo',
    'notes',
  ]),
  pathOr({}, repeat('customerSegment', 2)),
);

const CustomerSegmentEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.CUSTOMER_SEGMENT_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_CUSTOMER_SEGMENT}>
            {updateCustomerSegment => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                loading={query.loading}
                error={query.error}
                label="Customer segment"
                guidance="Customer segment"
                validate={validateCustomerSegment}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator = {},
                    color = {},
                    matchedTo,
                    percentOfMarketSize,
                    notes = '',
                  } = values;

                  return updateCustomerSegment({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        percentOfMarketSize,
                        originatorId: originator.value,
                        matchedTo: convertDocumentOptions({
                          documentType: CanvasTypes.VALUE_PROPOSITION,
                        }, matchedTo),
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }}
              >
                {({ form: { form } }) => (
                  <CustomerSegmentForm {...{ organizationId }} save={form.submit} />
                )}
              </EntityModalNext>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </WithState>
);

CustomerSegmentEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CustomerSegmentEditModal);
