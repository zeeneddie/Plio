import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
  find,
  where,
  contains,
  merge,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop, getValue } from 'plio-util';
import moment from 'moment';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const getAction = pathOr({}, repeat('action', 2));
const getInitialValues = compose(
  over(lenses.startDate, moment),
  over(lenses.endDate, moment),
  over(lenses.completedAt, unless(isNil, moment)),
  over(lenses.owner, getUserOptions),
  over(lenses.completedBy, getUserOptions),

  over(lenses.toBeCompletedBy, getUserOptions),
  over(lenses.completionTargetDate, moment),
  over(lenses.verifiedAt, unless(isNil, moment)),
  over(lenses.verifiedBy, getUserOptions),
  over(lenses.toBeVerifiedBy, getUserOptions),
  over(lenses.verificationTargetDate, moment),
  pick([
    'title',
    'description',
    'toBeCompletedBy',
    'planInPlace',
    'completionTargetDate',
    'owner',
    'completedAt',
    'completedBy',
    'completionComments',
    'verifiedAt',
    'verifiedBy',
    'verificationComments',
    'toBeVerifiedBy',
    'verificationTargetDate',
    'isCompleted',
  ]),
);

const ActionEditContainer = ({
  action: _action = null,
  actionId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      action: _action,
      initialValues: unless(isNil, getInitialValues, _action),
    }}
  >
    {({ state: { initialValues, action }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.ACTION_CARD}
            variables={{ _id: actionId }}
            skip={!isOpen || !!_action}
            onCompleted={data => setState({
              initialValues: getInitialValues(getAction(data)),
              action: getAction(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_ACTION}
            children={noop}
            onCompleted={({ updateGoal }) => setState({ action: updateGoal })}
          />,
          <Mutation
            mutation={Mutations.DELETE_ACTION}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.COMPLETE_ACTION}
            children={noop}
            onCompleted={({ completeAction }) => {
              const newAction = merge(action, completeAction);
              setState({ action: newAction, initialValues: getInitialValues(newAction) });
            }}
          />,
          <Mutation
            mutation={Mutations.UNDO_ACTION_COMPLETION}
            children={noop}
            onCompleted={
              ({ undoActionCompletion }) => {
                const newAction = merge(action, undoActionCompletion);
                setState({ goal: newAction, initialValues: getInitialValues(newAction) });
              }
            }
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateAction,
          // deleteAction,
          completeAction,
          undoActionCompletion,
        ]) => renderComponent({
          ...props,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          action,
          loading,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(action);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              description = '',
              owner: { value: ownerId } = {},
              isCompleted,
              completionComment = '',
              completedAt,
              completedBy,
              verificationComments,
              toBeCompletedBy,
              planInPlace,
              completionTargetDate,
              verifiedAt,
              verifiedBy,
              toBeVerifiedBy,
              verificationTargetDate,
            } = values;

            const isCompletedDiff = find(where({ path: contains('isCompleted') }), difference);

            if (isCompletedDiff) {
              if (isCompleted) {
                return completeAction({
                  variables: {
                    input: {
                      _id: action._id,
                      completionComment,
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }

              return undoActionCompletion({
                variables: {
                  input: { _id: action._id },
                },
              }).then(noop).catch((err) => {
                form.reset(currentValues);
                throw err;
              });
            }

            const args = {
              variables: {
                input: {
                  _id: action._id,
                  title,
                  description,
                  ownerId,
                  planInPlace,
                  completionComment,
                  verificationComments,
                  completedAt,
                  verifiedAt,
                  completionTargetDate,
                  verificationTargetDate,
                  completedBy: getValue(completedBy),
                  toBeCompletedBy: getValue(toBeCompletedBy),
                  toBeVerifiedBy: getValue(toBeVerifiedBy),
                  verifiedBy: getValue(verifiedBy),
                },
              },
            };

            return updateAction(args).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => {
            if (onDelete) return onDelete();
            console.log(onDelete);
            return null;
          },
        })}
      </Composer>
    )}
  </WithState>
);

ActionEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  actionId: PropTypes.string,
  action: PropTypes.object,
  fetchPolicy: PropTypes.string,
  canEditGoals: PropTypes.bool,
};

export default pure(ActionEditContainer);
