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
import { validateCustomerRelationship } from '../../../validation';
import { WithState } from '../../helpers';
import CanvasForm from './CanvasForm';

const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'notes',
  ]),
  pathOr({}, repeat('customerRelationship', 2)),
);

const CustomerRelationshipEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.CUSTOMER_RELATIONSHIP_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_CUSTOMER_RELATIONSHIP}>
            {updateCustomerRelationship => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                loading={query.loading}
                error={query.error}
                label="Customer relationship"
                guidance="Customer relationship"
                validate={validateCustomerRelationship}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    notes = '',
                  } = values;

                  return updateCustomerRelationship({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
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
                  <CanvasForm {...{ organizationId }} save={form.submit} />
                )}
              </EntityModalNext>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </WithState>
);

CustomerRelationshipEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CustomerRelationshipEditModal);
