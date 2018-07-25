import UPDATE_GOAL_TITLE from './UpdateGoalTitle.graphql';
import UPDATE_GOAL_DESCRIPTION from './UpdateGoalDescription.graphql';
import UPDATE_GOAL_OWNER from './UpdateGoalOwner.graphql';
import UPDATE_GOAL_START_DATE from './UpdateGoalStartDate.graphql';
import UPDATE_GOAL_END_DATE from './UpdateGoalEndDate.graphql';
import UPDATE_GOAL_PRIORITY from './UpdateGoalPriority.graphql';
import UPDATE_GOAL_COLOR from './UpdateGoalColor.graphql';
import UPDATE_GOAL_STATUS_COMMENT from './UpdateGoalStatusComment.graphql';
import COMPLETE_GOAL from './CompleteGoal.graphql';
import UPDATE_GOAL_COMPLETION_COMMENT from './UpdateGoalCompletionComment.graphql';
import UPDATE_GOAL_COMPLETED_AT from './UpdateGoalCompletedAt.graphql';
import UPDATE_GOAL_COMPLETED_BY from './UpdateGoalCompletedBy.graphql';
import UNDO_GOAL_COMPLETION from './UndoGoalCompletion.graphql';
import DELETE_GOAL from './DeleteGoal.graphql';
import RESTORE_GOAL from './RestoreGoal.graphql';
import REMOVE_GOAL from './RemoveGoal.graphql';
import LINK_RISK_TO_GOAL from './LinkRiskToGoal.graphql';
import LINK_FILE_TO_GOAL from './LinkFileToGoal.graphql';
import UNLINK_FILE_FROM_GOAL from './UnlinkFileFromGoal.graphql';
import CREATE_GOAL from './CreateGoal.graphql';
import ADD_GOAL_NOTIFY_USER from './AddGoalNotifyUser.graphql';
import REMOVE_GOAL_NOTIFY_USER from './RemoveGoalNotifyUser.graphql';

LINK_FILE_TO_GOAL.name = 'linkFileToGoal';
UNLINK_FILE_FROM_GOAL.name = 'unlinkFileFromGoal';
ADD_GOAL_NOTIFY_USER.name = 'addGoalNotifyUser';
REMOVE_GOAL_NOTIFY_USER.name = 'removeGoalNotifyUser';
UNDO_GOAL_COMPLETION.name = 'undoGoalCompletion';
RESTORE_GOAL.name = 'restoreGoal';
REMOVE_GOAL.name = 'removeGoal';

export default {
  UPDATE_GOAL_TITLE,
  UPDATE_GOAL_DESCRIPTION,
  UPDATE_GOAL_OWNER,
  UPDATE_GOAL_START_DATE,
  UPDATE_GOAL_END_DATE,
  UPDATE_GOAL_PRIORITY,
  UPDATE_GOAL_COLOR,
  UPDATE_GOAL_STATUS_COMMENT,
  COMPLETE_GOAL,
  UPDATE_GOAL_COMPLETION_COMMENT,
  UPDATE_GOAL_COMPLETED_AT,
  UPDATE_GOAL_COMPLETED_BY,
  UNDO_GOAL_COMPLETION,
  DELETE_GOAL,
  RESTORE_GOAL,
  REMOVE_GOAL,
  LINK_RISK_TO_GOAL,
  LINK_FILE_TO_GOAL,
  UNLINK_FILE_FROM_GOAL,
  CREATE_GOAL,
  ADD_GOAL_NOTIFY_USER,
  REMOVE_GOAL_NOTIFY_USER,
};
