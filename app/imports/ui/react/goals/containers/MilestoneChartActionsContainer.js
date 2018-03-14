import connectUI from 'redux-ui';
import { graphql } from 'react-apollo';
import { Cache } from 'plio-util';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { Mutation, Fragment } from '../../../../client/graphql';
import { withStore } from '../../helpers';
import { swal } from '../../../../client/util';
import { updateGoalFragment } from '../../../../client/apollo';
import ChartActions from '../components/ChartActions';

const enhance = compose(
  withStore,
  connectUI(),
  onlyUpdateForKeys(['_id', 'title', 'goalId']),
  withHandlers({
    onEdit: ({ goalId, updateUI, togglePopover }) => () => {
      togglePopover();
      updateUI({
        isEditModalOpen: true,
        activeGoal: goalId,
      });
    },
  }),
  graphql(Mutation.DELETE_MILESTONE, {
    props: ({
      mutate,
      ownProps: {
        _id,
        goalId,
        title,
        togglePopover,
      },
    }) => ({
      onDelete: () => {
        togglePopover();
        swal.promise({
          text: `The milestone "${title}" will be deleted`,
          confirmButtonText: 'Delete',
        }, () => mutate({
          variables: {
            input: { _id },
          },
          update: updateGoalFragment(Cache.deleteMilestoneById(_id), {
            id: goalId,
            fragment: Fragment.DASHBOARD_GOAL,
          }),
        }));
      },
    }),
  }),
);

export default enhance(ChartActions);
