import COMPLETE_ACTION from './CompleteAction.graphql';
import UNDO_ACTION_COMPLETION from './UndoActionCompletion.graphql';
import VERIFY_ACTION from './VerifyAction.graphql';
import UNDO_ACTION_VERIFICATION from './UndoActionVerification.graphql';
import DELETE_ACTION from './DeleteAction.graphql';
import CREATE_ACTION from './CreateAction.graphql';
import LINK_DOC_TO_ACTION from './LinkDocToAction.graphql';
import UNLINK_DOC_FROM_ACTION from './UnlinkDocFromAction.graphql';
import UPDATE_ACTION from './UpdateAction.graphql';

COMPLETE_ACTION.name = 'completeAction';
UNDO_ACTION_COMPLETION.name = 'undoActionCompletion';
VERIFY_ACTION.name = 'verifyAction';
UNDO_ACTION_VERIFICATION.name = 'undoActionVerification';
DELETE_ACTION.name = 'deleteAction';
CREATE_ACTION.name = 'createAction';
LINK_DOC_TO_ACTION.name = 'linkDocToAction';
UNLINK_DOC_FROM_ACTION.name = 'unlinkDocFromAction';

export default {
  COMPLETE_ACTION,
  UNDO_ACTION_COMPLETION,
  VERIFY_ACTION,
  UNDO_ACTION_VERIFICATION,
  DELETE_ACTION,
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
  UNLINK_DOC_FROM_ACTION,
  UPDATE_ACTION,
};
