import DASHBOARD_GOAL from './DashboardGoal.graphql';
import COMPLETED_DELETED_GOALS from './CompletedDeletedGoal.graphql';
import GOAL_CARD from './GoalCard.graphql';
import MILESTONE_CARD from './MilestoneCard.graphql';
import RISK_CARD from './RiskCard.graphql';
import LESSON_CARD from './LessonCard.graphql';
import ACTION_CARD from './ActionCard.graphql';
import DASHBOARD_ACTION from './DashboardAction.graphql';
import KEY_PARTNER_CARD from './KeyPartnerCard.graphql';
import REVENUE_STREAM_CARD from './RevenueStreamCard.graphql';
import COST_LINE_CARD from './CostLineCard.graphql';
import CHANNEL_CARD from './ChannelCard.graphql';
import CUSTOMER_RELATIONSHIP_CARD from './CustomerRelationshipCard.graphql';
import KEY_RESOURCE_CARD from './KeyResourceCard.graphql';
import CANVAS_SETTINGS from './CanvasSettings.graphql';
import KEY_ACTIVITY_CARD from './KeyActivityCard.graphql';

DASHBOARD_GOAL.fragmentName = 'DashboardGoal';
GOAL_CARD.fragmentName = 'GoalCard';
MILESTONE_CARD.fragmentName = 'MilestoneCard';
COMPLETED_DELETED_GOALS.fragmentName = 'CompletedDeletedGoal';
RISK_CARD.fragmentName = 'RiskCard';
LESSON_CARD.fragmentName = 'LessonCard';
ACTION_CARD.fragmentName = 'ActionCard';
DASHBOARD_ACTION.fragmentName = 'DashboardAction';
KEY_PARTNER_CARD.fragmentName = 'KeyPartnerCard';
REVENUE_STREAM_CARD.fragmentName = 'RevenueStreamCard';
COST_LINE_CARD.fragmentName = 'CostLineCard';
CHANNEL_CARD.fragmentName = 'ChannelCard';
CUSTOMER_RELATIONSHIP_CARD.fragmentName = 'CustomerRelationshipCard';
KEY_RESOURCE_CARD.fragmentName = 'KeyResourceCard';
CANVAS_SETTINGS.fragmentName = 'CanvasSettings';
KEY_ACTIVITY_CARD.fragmentName = 'KeyActivityCard';

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
  REVENUE_STREAM_CARD,
  COST_LINE_CARD,
  CHANNEL_CARD,
  CANVAS_SETTINGS,
  CUSTOMER_RELATIONSHIP_CARD,
  KEY_RESOURCE_CARD,
  KEY_ACTIVITY_CARD,
};
