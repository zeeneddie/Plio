import { graphql } from 'react-apollo';
import { lenses, byCompletedOrDeletedAt, Cache } from 'plio-util';
import { view, sort, prop, propEq } from 'ramda';
import {
  setPropTypes,
  withState,
  withProps,
  withHandlers,
  branch,
  compose,
  renderNothing,
} from 'recompose';
import PropTypes from 'prop-types';
import CompletedDeletedGoals from '../components/CompletedDeletedGoals';
import { DeletedGoalShowTypes } from '../constants';
import { moveGoalWithinCacheAfterRestoring } from '../../../../client/apollo/utils/goals';
import { Query, Mutation } from '../../../../client/graphql';
import { isActionCompletedAtDeadlineDue } from '../../../../share/checkers';
import {
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { namedCompose, withPreloader, omitProps, withHr } from '../../helpers';
import { swal } from '../../../../client/util';
import { updateQueryCache } from '../../../../client/apollo/utils';

const defaultItemsPerRow =
  WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS];

const getRestoreOptions = (handler, mutation) => ({
  props: ({ mutate, ownProps: { organizationId } }) => ({
    [handler]: ({ _id, title }) => swal.promise({
      text: `The key goal "${title}" will be restored!`,
      confirmButtonText: 'Restore',
      successTitle: 'Restored!',
      successText: `The key goal "${title}" was restored successfully.`,
    }, () => mutate({
      variables: { input: { _id } },
      update: (store, { data: { [mutation]: { goal } } }) => {
        moveGoalWithinCacheAfterRestoring(organizationId, goal, store);
      },
    })),
  }),
});

export default namedCompose('CompletedDeletedGoalsContainer')(
  withState('showType', 'setShowType', DeletedGoalShowTypes.LATEST),
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  graphql(Query.COMPLETED_DELETED_GOALS, {
    options: ({
      organizationId,
      deletedItemsPerRow = defaultItemsPerRow,
    }) => ({
      variables: {
        organizationId,
        limit: deletedItemsPerRow,
      },
    }),
    props: ({ data, ownProps }) => {
      const { goals, totalCount } = data.goals || {};
      return {
        totalCount,
        goals: goals && sort(byCompletedOrDeletedAt, goals),
        loading: data.loading,
        loadAllDeletedGoals: () => data.fetchMore({
          variables: {
            organizationId: ownProps.organizationId,
            limit: totalCount,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            ownProps.setShowType(DeletedGoalShowTypes.ALL);
            return fetchMoreResult;
          },
        }),
      };
    },
  }),
  withProps(({
    goals = [],
    showType,
    totalCount,
    deletedItemsPerRow,
  }) => {
    const isLatestType = showType === DeletedGoalShowTypes.LATEST;
    const canSliceList = isLatestType && totalCount > deletedItemsPerRow;
    const newGoalsList = canSliceList ? goals.slice(0, deletedItemsPerRow) : goals;
    const moreItemsCount = totalCount - newGoalsList.length;
    return {
      moreItemsCount,
      isAllBtn: isLatestType && moreItemsCount > 0,
      goals: newGoalsList,
    };
  }),
  withHandlers({
    canRestore: () => ({ isDeleted, completedAt }) =>
      (!isDeleted ? isActionCompletedAtDeadlineDue({ completedAt }) : true),
  }),
  withPreloader(view(lenses.loading), () => ({ size: 1 })),
  omitProps(['loading']),
  branch(
    propEq('showType', DeletedGoalShowTypes.ALL),
    withHandlers({
      showLatestItems: ({ setShowType }) => () => setShowType(DeletedGoalShowTypes.LATEST),
    }),
  ),
  branch(
    prop('canEditGoals'),
    compose(
      graphql(
        Mutation.UNDO_GOAL_COMPLETION,
        getRestoreOptions('onUndoCompletion', 'undoGoalCompletion'),
      ),
      graphql(
        Mutation.RESTORE_GOAL,
        getRestoreOptions('onRestore', 'restoreGoal'),
      ),
      graphql(Mutation.REMOVE_GOAL, {
        props: ({ mutate, ownProps: { organizationId } }) => ({
          onRemove: ({ _id, title }) => swal.promise({
            text: `The goal "${title}" will be deleted permanently`,
            confirmButtonText: 'Delete',
            successTitle: 'Deleted!',
            successText: `The key goal "${title}" was removed successfully.`,
          }, () => mutate({
            variables: { input: { _id } },
            update: (store) => {
              updateQueryCache(Cache.deleteGoalFromQuery(_id), {
                variables: { organizationId },
                query: Query.COMPLETED_DELETED_GOALS,
              }, store);
            },
          })),
        }),
      }),
    ),
  ),
  branch(
    prop('totalCount'),
    withHr,
    renderNothing,
  ),
)(CompletedDeletedGoals);
