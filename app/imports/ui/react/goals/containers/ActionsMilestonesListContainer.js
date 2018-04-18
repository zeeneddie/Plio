import { reject } from 'ramda';
import { withProps, compose, withHandlers } from 'recompose';
import { isCompleted } from 'plio-util';
import connectUI from 'redux-ui';
import withStateToggle from '../../helpers/withStateToggle';
import ActionsMilestonesList from '../components/ActionsMilestonesList';

export default compose(
  connectUI(),
  withStateToggle(false, 'isOpen', 'toggle'),
  withProps(({ goal }) => ({
    items: reject(isCompleted, goal.points),
    title: goal.title,
  })),
  withHandlers({
    onEditGoal: ({ updateUI, goal }) => () => (
      updateUI({
        isEditModalOpen: true,
        activeGoal: goal._id,
      })
    ),
    onAddAction: ({ updateUI, goal }) => () => (
      updateUI({
        isActionModalOpen: true,
        activeGoal: goal._id,
        activeAction: null,
      })
    ),
    onAddMilestone: ({ updateUI, goal }) => () => (
      updateUI({
        isMilestoneModalOpen: true,
        activeGoal: goal._id,
        activeMilestone: null,
      })
    ),
  }),
)(ActionsMilestonesList);
