import PropTypes from 'prop-types';
import React from 'react';
import diff from 'deep-diff';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateKeyActivity } from '../../../validation';
import { EntityModalNext } from '../../components';
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
  pathOr({}, repeat('keyActivity', 2)),
);

const KeyActivityEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.KEY_ACTIVITY_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_KEY_ACTIVITY}>
            {updateKeyActivity => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                label="Key activity"
                loading={query.loading}
                error={query.error}
                guidance="Key activity"
                validate={validateKeyActivity}
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

                  return updateKeyActivity({
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

KeyActivityEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(KeyActivityEditModal);
