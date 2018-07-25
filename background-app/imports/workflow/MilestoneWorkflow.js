import Workflow from './Workflow';
import { WorkflowTypes, DocumentTypes } from '../share/constants';
import { Milestones } from '../share/collections';
import { getMilestoneStatus } from '../share/helpers';

export default class GoalWorkflow extends Workflow {
  static get _collection() {
    return Milestones;
  }

  static get _docType() {
    return DocumentTypes.MILESTONE;
  }

  _prepare() {
    super._prepare();
    this._workflowType = this._getWorkflowType();
  }

  _getThreeStepStatus() {
    return getMilestoneStatus(this._timezone, this._doc);
  }

  _getWorkflowType() {
    return WorkflowTypes.THREE_STEP;
  }
}
