import Workflow from './Workflow';
import { WorkflowTypes, DocumentTypes } from '../share/constants';
import { Goals } from '../share/collections';
import { getGoalStatus } from '../share/helpers';

export default class GoalWorkflow extends Workflow {
  static get _collection() {
    return Goals;
  }

  static get _docType() {
    return DocumentTypes.GOAL;
  }

  _prepare() {
    super._prepare();
    this._workflowType = this._getWorkflowType();
  }

  _getThreeStepStatus() {
    return getGoalStatus(this._timezone, this._doc);
  }

  _getWorkflowType() {
    return WorkflowTypes.THREE_STEP;
  }
}
