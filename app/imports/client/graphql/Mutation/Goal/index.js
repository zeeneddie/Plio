import COMPLETE_GOAL from './CompleteGoal.graphql';
import UNDO_GOAL_COMPLETION from './UndoGoalCompletion.graphql';
import DELETE_GOAL from './DeleteGoal.graphql';
import RESTORE_GOAL from './RestoreGoal.graphql';
import REMOVE_GOAL from './RemoveGoal.graphql';
import CREATE_GOAL from './CreateGoal.graphql';
import UPDATE_GOAL from './UpdateGoal.graphql';

UNDO_GOAL_COMPLETION.name = 'undoGoalCompletion';
RESTORE_GOAL.name = 'restoreGoal';
REMOVE_GOAL.name = 'removeGoal';

export default {
  COMPLETE_GOAL,
  UNDO_GOAL_COMPLETION,
  DELETE_GOAL,
  RESTORE_GOAL,
  REMOVE_GOAL,
  CREATE_GOAL,
  UPDATE_GOAL,
};
