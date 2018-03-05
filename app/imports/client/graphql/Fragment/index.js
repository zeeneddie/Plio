import DASHBOARD_GOAL from './DashboardGoal.graphql';
import COMPLETED_DELETED_GOALS from './CompletedDeletedGoal.graphql';
import GOAL_CARD from './GoalCard.graphql';
import MILESTONE_CARD from './MilestoneCard.graphql';

DASHBOARD_GOAL.fragmentName = 'DashboardGoal';
GOAL_CARD.fragmentName = 'GoalCard';
MILESTONE_CARD.fragmentName = 'MilestoneCard';
COMPLETED_DELETED_GOALS.fragmentName = 'CompletedDeletedGoal';

export default {
  DASHBOARD_GOAL,
  GOAL_CARD,
  MILESTONE_CARD,
  COMPLETED_DELETED_GOALS,
};
