import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getEntityOptions, getUserOptions, lenses, noop, convertDocumentOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModalNext } from '../../components';
import { CanvasTypes } from '../../../../share/constants';
import { validateValueProposition } from '../../../validation';
import { WithState } from '../../helpers';
import ValuePropositionForm from './ValuePropositionForm';
import ValueComponentsSubcard from './ValueComponentsSubcard';

const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'matchedTo',
    'notes',
  ]),
  pathOr({}, repeat('valueProposition', 2)),
);

const ValuePropositionEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Query
        query={Queries.VALUE_PROPOSITION_CARD}
        variables={{ _id }}
        skip={!isOpen}
        onCompleted={data => setState({ initialValues: getInitialValues(data) })}
        fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
      >
        {({ data, ...query }) => (
          <Mutation mutation={Mutations.UPDATE_VALUE_PROPOSITION}>
            {updateValueProposition => (
              <EntityModalNext
                {...{ isOpen, toggle, initialValues }}
                isEditMode
                loading={query.loading}
                error={query.error}
                label="Value proposition"
                guidance="Value proposition"
                validate={validateValueProposition}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    matchedTo,
                    notes = '',
                  } = values;

                  return updateValueProposition({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        originatorId: originator.value,
                        matchedTo: convertDocumentOptions({
                          documentType: CanvasTypes.CUSTOMER_SEGMENT,
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
                  <Fragment>
                    <ValuePropositionForm {...{ organizationId }} save={form.submit} />
                    <ValueComponentsSubcard />
                  </Fragment>
                )}
              </EntityModalNext>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </WithState>
);

ValuePropositionEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(ValuePropositionEditModal);
