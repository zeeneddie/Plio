import { Actions } from '../share/collections';
import {
  getActionWorkflowType,
  getActionThreeStepStatus,
  getActionSixStepStatus,
} from '../share/helpers';
import Workflow from './Workflow';
import NCWorkflow from './NCWorkflow';
import RiskWorkflow from './RiskWorkflow';

export default class ActionWorkflow extends Workflow {
  _prepare() {
    super._prepare();
    this._workflowType = this._getWorkflowType();
  }

  _getThreeStepStatus() {
    return getActionThreeStepStatus(this._timezone, this._doc);
  }

  _getSixStepStatus() {
    return getActionSixStepStatus(this._timezone, this._doc);
  }

  _onUpdateStatus() {
    const action = this._doc;

    const NCsIds = action.getLinkedNCsIds();
    NCsIds.forEach(id => new NCWorkflow(id).refreshStatus());

    const risksIds = action.getLinkedRisksIds();
    risksIds.forEach(id => new RiskWorkflow(id).refreshStatus());
  }

  _getWorkflowType() {
    return getActionWorkflowType(this._doc);
  }

  static get _collection() {
    return Actions;
  }
}
