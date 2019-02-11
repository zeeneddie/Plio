import { graphql } from 'react-apollo';
import { byCompletedOrDeletedAt } from 'plio-util';
import { sort, prop, mergeDeepLeft } from 'ramda';
import {
  setPropTypes,
  branch,
  compose,
  withHandlers,
} from 'recompose';
import PropTypes from 'prop-types';
import { memo } from 'react';

import CompletedDeletedGoals from '../components/CompletedDeletedGoals';
import { Query, Mutation } from '../../../graphql';
import { isActionCompletedAtDeadlineDue } from '../../../../share/checkers';
import { namedCompose, withToggle, withApolloPreloader, withHr } from '../../helpers';
import { createRestoreHandler, onRemove } from '../handlers';

const {
  UNDO_GOAL_COMPLETION,
  RESTORE_GOAL,
  REMOVE_GOAL,
} = Mutation;

export default namedCompose('CompletedDeletedGoalsContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
    itemsPerRow: PropTypes.number.isRequired,
    canEditGoals: PropTypes.bool,
  }),
  memo,
  withToggle(),
  graphql(Query.COMPLETED_DELETED_GOALS, {
    options: ({ organizationId, itemsPerRow }) => ({
      variables: {
        organizationId,
        limit: itemsPerRow,
      },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({
      data: {
        loading,
        networkStatus,
        fetchMore,
        goals: {
          goals = [],
          totalCount,
        } = {},
      },
      ownProps: {
        isOpen,
        toggle,
      },
    }) => ({
      networkStatus,
      totalCount,
      loading,
      goals: sort(byCompletedOrDeletedAt, goals),
      toggle: async () => {
        if (!isOpen && goals.length < totalCount) {
          await fetchMore({
            variables: { limit: totalCount },
            updateQuery: (prev, { fetchMoreResult }) => mergeDeepLeft(fetchMoreResult, prev),
          });
        }

        toggle();
      },
    }),
  }),
  withApolloPreloader(),
  withHandlers({
    canRestore: () => ({ isDeleted, completedAt }) =>
      !isDeleted ? isActionCompletedAtDeadlineDue({ completedAt }) : true,
  }),
  branch(
    prop('canEditGoals'),
    compose(
      ...[
        UNDO_GOAL_COMPLETION,
        RESTORE_GOAL,
        REMOVE_GOAL,
      ].map(mutation => graphql(mutation, { name: mutation.name })),
      withHandlers({
        onRemove,
        onUndoCompletion: createRestoreHandler(UNDO_GOAL_COMPLETION.name),
        onRestore: createRestoreHandler(RESTORE_GOAL.name),
      }),
    ),
  ),
  withHr,
)(CompletedDeletedGoals);
