import CREATE_RISK from './CreateRisk.graphql';
import DELETE_RISK from './DeleteRisk.graphql';
import LINK_STANDARD_TO_RISK from './LinkStandardToRisk.graphql';
import UPDATE_RISK_DESCRIPTION from './UpdateRiskDescription.graphql';
import UPDATE_RISK_MAGNITUDE from './UpdateRiskMagnitude.graphql';
import UPDATE_RISK_ORIGINATOR from './UpdateRiskOriginator.graphql';
import UPDATE_RISK_OWNER from './UpdateRiskOwner.graphql';
import UPDATE_RISK_STATUS_COMMENT from './UpdateRiskStatusComment.graphql';
import UPDATE_RISK_TITLE from './UpdateRiskTitle.graphql';
import LINK_RISK_TYPE_TO_RISK from './LinkRiskTypeToRisk.graphql';
import UPDATE_RISK_STANDARDS from './UpdateRiskStandards.graphql';
import UPDATE_RISK_DEPARTMENTS from './UpdateRiskDepartments.graphql';
import COMPLETE_RISK_ANALYSIS from './CompleteRiskAnalysis.graphql';
import UNDO_RISK_ANALYSIS_COMPLETION from './UndoRiskAnalysisCompletion.graphql';
import SET_RISK_ANALYSIS_TARGET_DATE from './SetRiskAnalysisTargetDate.graphql';
import SET_RISK_ANALYSIS_EXECUTOR from './SetRiskAnalysisExecutor.graphql';
import SET_RISK_ANALYSIS_COMPLETED_BY from './SetRiskAnalysisCompletedBy.graphql';
import SET_RISK_ANALYSIS_COMPLETED_AT from './SetRiskAnalysisCompletedAt.graphql';
import SET_RISK_ANALYSIS_COMPLETION_COMMENTS from './SetRiskAnalysisCompletionComments.graphql';

CREATE_RISK.name = 'createRisk';
DELETE_RISK.name = 'deleteRisk';
LINK_STANDARD_TO_RISK.name = 'linkStandardToRisk';
UPDATE_RISK_DESCRIPTION.name = 'updateRiskDescription';
UPDATE_RISK_MAGNITUDE.name = 'updateRiskMagnitude';
UPDATE_RISK_ORIGINATOR.name = 'updateRiskOriginator';
UPDATE_RISK_OWNER.name = 'updateRiskOwner';
UPDATE_RISK_STATUS_COMMENT.name = 'updateRiskStatusComment';
UPDATE_RISK_TITLE.name = 'updateRiskTitle';
LINK_RISK_TYPE_TO_RISK.name = 'linkRiskTypeToRisk';
UPDATE_RISK_STANDARDS.name = 'updateRiskStandards';
UPDATE_RISK_DEPARTMENTS.name = 'updateRiskDepartments';
SET_RISK_ANALYSIS_TARGET_DATE.name = 'setRiskAnalysisTargetDate';
SET_RISK_ANALYSIS_EXECUTOR.name = 'setRiskAnalysisExecutor';
COMPLETE_RISK_ANALYSIS.name = 'completeRiskAnalysis';
UNDO_RISK_ANALYSIS_COMPLETION.name = 'undoRiskAnalysisCompletion';
SET_RISK_ANALYSIS_COMPLETED_BY.name = 'setRiskAnalysisCompletedBy';
SET_RISK_ANALYSIS_COMPLETED_AT.name = 'setRiskAnalysisCompletedAt';
SET_RISK_ANALYSIS_COMPLETION_COMMENTS.name = 'setRiskAnalysisCompletionComments';

export default {
  CREATE_RISK,
  DELETE_RISK,
  LINK_STANDARD_TO_RISK,
  UPDATE_RISK_DESCRIPTION,
  UPDATE_RISK_MAGNITUDE,
  UPDATE_RISK_ORIGINATOR,
  UPDATE_RISK_OWNER,
  UPDATE_RISK_STATUS_COMMENT,
  UPDATE_RISK_TITLE,
  LINK_RISK_TYPE_TO_RISK,
  UPDATE_RISK_STANDARDS,
  UPDATE_RISK_DEPARTMENTS,
  SET_RISK_ANALYSIS_TARGET_DATE,
  SET_RISK_ANALYSIS_EXECUTOR,
  COMPLETE_RISK_ANALYSIS,
  UNDO_RISK_ANALYSIS_COMPLETION,
  SET_RISK_ANALYSIS_COMPLETED_BY,
  SET_RISK_ANALYSIS_COMPLETED_AT,
  SET_RISK_ANALYSIS_COMPLETION_COMMENTS,
};
