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
  path,
  pathEq,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import { noop, getValue } from 'plio-util';
import deepDiff from 'deep-diff';

import { swal } from '../../../util';
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
  getInitialValues,
  linkedTo,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      action: _action,
      initialValues: unless(isNil, getInitialValues, _action),
    }}
  >
    {({ state: { initialValues, action }, setState }) => {
      const updateActionInState = (mutatedAction) => {
        const newAction = merge(action, mutatedAction);
        setState({
          action: newAction,
          initialValues: getInitialValues(newAction),
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
                initialValues: getInitialValues(getAction(data)),
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
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.LINK_DOC_TO_ACTION}
              children={noop}
              onCompleted={({ linkDocToAction }) => updateActionInState(linkDocToAction)}
            />,
            <Mutation
              {...{ refetchQueries }}
              mutation={Mutations.UNLINK_DOC_FROM_ACTION}
              children={noop}
              onCompleted={({ unlinkDocFromAction }) => updateActionInState(unlinkDocFromAction)}
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
            linkDocToAction,
            unlinkDocFromAction,
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
              const difference = deepDiff(currentValues, values);

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

              const handleError = (err) => {
                form.reset(currentValues);
                throw err;
              };

              // Complete/undo completion
              const isCompletedDiff = find(where({ path: contains('isCompleted') }), difference);

              if (isCompletedDiff) {
                if (isCompleted) {
                  return completeAction({
                    variables: {
                      input: {
                        _id: action._id,
                        completionComments,
                      },
                    },
                  }).then(noop).catch(handleError);
                }

                return undoActionCompletion({
                  variables: {
                    input: { _id: action._id },
                  },
                }).then(noop).catch(handleError);
              }

              // Verify/undo verification
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
                  }).then(noop).catch(handleError);
                }

                return undoActionVerification({
                  variables: {
                    input: { _id: action._id },
                  },
                }).then(noop).catch(handleError);
              }

              // Link/unlink
              const linkedDiff = find(where({ path: contains('linkedTo') }), difference);

              if (linkedDiff) {
                const isLinked = pathEq('N', ['item', 'kind'], linkedDiff);
                const linkedId = path(['item', 'rhs', 'value'], linkedDiff);
                if (isLinked && linkedId) {
                  return linkDocToAction({
                    variables: {
                      input: {
                        _id: action._id,
                        documentType: linkedTo.documentType,
                        documentId: linkedId,
                      },
                    },
                  }).then(noop).catch(handleError);
                }

                const isUnlinked = pathEq('D', ['item', 'kind'], linkedDiff);
                const unlinkedId = path(['item', 'lhs', 'value'], linkedDiff);
                if (isUnlinked && unlinkedId) {
                  return unlinkDocFromAction({
                    variables: {
                      input: {
                        _id: action._id,
                        documentId: unlinkedId,
                      },
                    },
                  }).then(noop).catch(handleError);
                }
              }

              // Update
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

              return updateAction(args).then(noop).catch(handleError);
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
  getInitialValues: PropTypes.func.isRequired,
  linkedTo: PropTypes.object,
  onDelete: PropTypes.func,
  actionId: PropTypes.string,
  action: PropTypes.object,
  fetchPolicy: PropTypes.string,
  canEditGoals: PropTypes.bool,
  refetchQueries: PropTypes.func,
  canCompleteAnyAction: PropTypes.bool,
};

export default pure(ActionEditContainer);
