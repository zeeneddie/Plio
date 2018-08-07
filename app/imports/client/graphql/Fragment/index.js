import DASHBOARD_GOAL from './DashboardGoal.graphql';
import COMPLETED_DELETED_GOALS from './CompletedDeletedGoal.graphql';
import GOAL_CARD from './GoalCard.graphql';
import MILESTONE_CARD from './MilestoneCard.graphql';
import RISK_CARD from './RiskCard.graphql';
import LESSON_CARD from './LessonCard.graphql';
import ACTION_CARD from './ActionCard.graphql';
import DASHBOARD_ACTION from './DashboardAction.graphql';
import KEY_PARTNER_CARD from './KeyPartnerCard.graphql';
import CANVAS_SETTINGS from './CanvasSettings.graphql';

DASHBOARD_GOAL.fragmentName = 'DashboardGoal';
GOAL_CARD.fragmentName = 'GoalCard';
MILESTONE_CARD.fragmentName = 'MilestoneCard';
COMPLETED_DELETED_GOALS.fragmentName = 'CompletedDeletedGoal';
RISK_CARD.fragmentName = 'RiskCard';
LESSON_CARD.fragmentName = 'LessonCard';
ACTION_CARD.fragmentName = 'ActionCard';
DASHBOARD_ACTION.fragmentName = 'DashboardAction';
KEY_PARTNER_CARD.fragmentName = 'KeyPartnerCard';
CANVAS_SETTINGS.fragmentName = 'CanvasSettings';

export default {
  DASHBOARD_GOAL,
  GOAL_CARD,
  MILESTONE_CARD,
  COMPLETED_DELETED_GOALS,
  RISK_CARD,
  LESSON_CARD,
  ACTION_CARD,
  DASHBOARD_ACTION,
  KEY_PARTNER_CARD,
  CANVAS_SETTINGS,
};
