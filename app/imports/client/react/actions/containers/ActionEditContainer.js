import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
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
import { noop, getValue } from 'plio-util';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { getGeneralActionValuesByAction } from '../helpers';
import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const getAction = pathOr({}, repeat('action', 2));

const ActionEditContainer = ({
  action: _action = null,
  actionId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  refetchQueries,
  linkedToField,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      action: _action,
      initialValues: unless(isNil, getGeneralActionValuesByAction, _action),
    }}
  >
    {({ state: { initialValues, action }, setState }) => {
      const updateActionInState = (mutatedAction) => {
        const newAction = merge(action, mutatedAction);
        setState({
          action: newAction,
          initialValues: getGeneralActionValuesByAction(newAction),
        });
      };
      return (
        <Composer
          components={[
            /* eslint-disable react/no-children-prop */
            <Query
              {...{ fetchPolicy }}
              query={Queries.ACTION_CARD}
              variables={{ _id: actionId }}
              skip={!isOpen || !!_action}
              onCompleted={data => setState({
                initialValues: getGeneralActionValuesByAction(getAction(data)),
                action: getAction(data),
              })}
              children={noop}
            />,
            <Mutation
              mutation={Mutations.UPDATE_ACTION}
              children={noop}
              onCompleted={({ updateAction }) => setState({ action: updateAction })}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.DELETE_ACTION}
              children={noop}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.COMPLETE_ACTION}
              children={noop}
              onCompleted={({ completeAction }) => updateActionInState(completeAction)}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.UNDO_ACTION_COMPLETION}
              children={noop}
              onCompleted={({ undoActionCompletion }) => updateActionInState(undoActionCompletion)}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.VERIFY_ACTION}
              children={noop}
              onCompleted={({ verifyAction }) => updateActionInState(verifyAction)}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.UNDO_ACTION_VERIFICATION}
              children={noop}
              onCompleted={({ undoActionVerification }) =>
                updateActionInState(undoActionVerification)}
            />,
            /* eslint-enable react/no-children-prop */
          ]}
        >
          {([
            { loading, error },
            updateAction,
            deleteAction,
            completeAction,
            undoActionCompletion,
            verifyAction,
            undoActionVerification,
          ]) => renderComponent({
            ...props,
            error,
            organizationId,
            isOpen,
            toggle,
            initialValues,
            action,
            loading,
            linkedTo: linkedToField,
            onSubmit: async (values, form) => {
              const currentValues = getGeneralActionValuesByAction(action);
              const difference = diff(values, currentValues);

              if (!difference) return undefined;

              const {
                title,
                description = '',
                owner: { value: ownerId } = {},
                isCompleted,
                isVerified,
                isVerifiedAsEffective,
                completionComments = '',
                verificationComments = '',
                completedAt,
                completedBy,
                toBeCompletedBy,
                planInPlace,
                completionTargetDate,
                verifiedAt,
                verifiedBy,
                toBeVerifiedBy,
                verificationTargetDate,
              } = values;

              const isCompletedDiff = find(where({ path: contains('isCompleted') }), difference);
              const errorHandler = (err) => {
                form.reset(currentValues);
                throw err;
              };

              if (isCompletedDiff) {
                if (isCompleted) {
                  return completeAction({
                    variables: {
                      input: {
                        _id: action._id,
                        completionComments,
                      },
                    },
                  }).then(noop).catch(errorHandler);
                }

                return undoActionCompletion({
                  variables: {
                    input: { _id: action._id },
                  },
                }).then(noop).catch(errorHandler);
              }

              const isVerifiedDiff = find(where({ path: contains('isVerified') }), difference);

              if (isVerifiedDiff) {
                if (isVerified) {
                  return verifyAction({
                    variables: {
                      input: {
                        _id: action._id,
                        verificationComments,
                        isVerifiedAsEffective,
                      },
                    },
                  }).then(noop).catch(errorHandler);
                }

                return undoActionVerification({
                  variables: {
                    input: { _id: action._id },
                  },
                }).then(noop).catch(errorHandler);
              }

              const args = {
                variables: {
                  input: {
                    _id: action._id,
                    title,
                    description,
                    ownerId,
                    planInPlace,
                    completionComments,
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

              return updateAction(args).then(noop).catch(errorHandler);
            },
            onDelete: () => {
              if (onDelete) return onDelete();

              return swal.promise({
                text: `The action "${action.title}" will be deleted`,
                confirmButtonText: 'Delete',
                successTitle: 'Deleted!',
                successText: `The action "${action.title}" was deleted successfully.`,
              }, () => deleteAction({
                variables: {
                  input: { _id: action._id },
                },
              })).then(toggle || noop);
            },
          })}
        </Composer>
      );
    }}
  </WithState>
);

ActionEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  linkedToField: PropTypes.object,
  onDelete: PropTypes.func,
  actionId: PropTypes.string,
  action: PropTypes.object,
  fetchPolicy: PropTypes.string,
  canEditGoals: PropTypes.bool,
  refetchQueries: PropTypes.func,
  canCompleteAnyAction: PropTypes.bool,
};

export default pure(ActionEditContainer);
