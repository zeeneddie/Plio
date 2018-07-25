import UPDATE_ACTION_TITLE from './UpdateActionTitle.graphql';
import UPDATE_ACTION_DESCRIPTION from './UpdateActionDescription.graphql';
import UPDATE_ACTION_OWNER from './UpdateActionOwner.graphql';
import UPDATE_ACTION_PLAN_IN_PLACE from './UpdateActionPlanInPlace.graphql';
import UPDATE_ACTION_COMPLETION_TARGET_DATE from './UpdateActionCompletionTargetDate.graphql';
import UPDATE_ACTION_TO_BE_COMPLETED_BY from './UpdateActionToBeCompletedBy.graphql';
import COMPLETE_ACTION from './CompleteAction.graphql';
import UNDO_ACTION_COMPLETION from './UndoActionCompletion.graphql';
import VERIFY_ACTION from './VerifyAction.graphql';
import UNDO_ACTION_VERIFICATION from './UndoActionVerification.graphql';
import UPDATE_ACTION_COMPLETED_AT from './UpdateActionCompletedAt.graphql';
import UPDATE_ACTION_COMPLETED_BY from './UpdateActionCompletedBy.graphql';
import UPDATE_ACTION_COMPLETION_COMMENTS from './UpdateActionCompletionComments.graphql';
import UPDATE_ACTION_VERIFIED_AT from './UpdateActionVerifiedAt.graphql';
import UPDATE_ACTION_VERIFIED_BY from './UpdateActionVerifiedBy.graphql';
import UPDATE_ACTION_VERIFICATION_COMMENTS from './UpdateActionVerificationComments.graphql';
import UPDATE_ACTION_TO_BE_VERIFIED_BY from './UpdateActionToBeVerifiedBy.graphql';
import UPDATE_ACTION_VERIFICATION_TARGET_DATE from './UpdateActionVerificationTargetDate.graphql';
import DELETE_ACTION from './DeleteAction.graphql';
import CREATE_ACTION from './CreateAction.graphql';
import LINK_DOC_TO_ACTION from './LinkDocToAction.graphql';
import UNLINK_DOC_FROM_ACTION from './UnlinkDocFromAction.graphql';

UPDATE_ACTION_TITLE.name = 'updateActionTitle';
UPDATE_ACTION_DESCRIPTION.name = 'updateActionDescription';
UPDATE_ACTION_OWNER.name = 'updateActionOwner';
UPDATE_ACTION_PLAN_IN_PLACE.name = 'updateActionPlanInPlace';
UPDATE_ACTION_COMPLETION_TARGET_DATE.name = 'updateActionCompletionTargetDate';
UPDATE_ACTION_TO_BE_COMPLETED_BY.name = 'updateActionToBeCompletedBy';
COMPLETE_ACTION.name = 'completeAction';
UNDO_ACTION_COMPLETION.name = 'undoActionCompletion';
VERIFY_ACTION.name = 'verifyAction';
UNDO_ACTION_VERIFICATION.name = 'undoActionVerification';
UPDATE_ACTION_COMPLETED_AT.name = 'updateActionCompletedAt';
UPDATE_ACTION_COMPLETED_BY.name = 'updateActionCompletedBy';
UPDATE_ACTION_COMPLETION_COMMENTS.name = 'updateActionCompletionComments';
UPDATE_ACTION_VERIFIED_AT.name = 'updateActionVerifiedAt';
UPDATE_ACTION_VERIFIED_BY.name = 'updateActionVerifiedBy';
UPDATE_ACTION_VERIFICATION_COMMENTS.name = 'updateActionVerificationComments';
UPDATE_ACTION_TO_BE_VERIFIED_BY.name = 'updateActionToBeVerifiedBy';
UPDATE_ACTION_VERIFICATION_TARGET_DATE.name = 'updateActionVerificationTargetDate';
DELETE_ACTION.name = 'deleteAction';
CREATE_ACTION.name = 'createAction';
LINK_DOC_TO_ACTION.name = 'linkDocToAction';
UNLINK_DOC_FROM_ACTION.name = 'unlinkDocFromAction';

export default {
  UPDATE_ACTION_TITLE,
  UPDATE_ACTION_DESCRIPTION,
  UPDATE_ACTION_OWNER,
  UPDATE_ACTION_PLAN_IN_PLACE,
  UPDATE_ACTION_COMPLETION_TARGET_DATE,
  UPDATE_ACTION_TO_BE_COMPLETED_BY,
  COMPLETE_ACTION,
  UNDO_ACTION_COMPLETION,
  VERIFY_ACTION,
  UNDO_ACTION_VERIFICATION,
  UPDATE_ACTION_COMPLETED_AT,
  UPDATE_ACTION_COMPLETED_BY,
  UPDATE_ACTION_COMPLETION_COMMENTS,
  UPDATE_ACTION_VERIFIED_AT,
  UPDATE_ACTION_VERIFIED_BY,
  UPDATE_ACTION_VERIFICATION_COMMENTS,
  UPDATE_ACTION_TO_BE_VERIFIED_BY,
  UPDATE_ACTION_VERIFICATION_TARGET_DATE,
  DELETE_ACTION,
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
  UNLINK_DOC_FROM_ACTION,
};
