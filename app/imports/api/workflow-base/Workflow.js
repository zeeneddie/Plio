import { WorkflowTypes } from '../constants.js';


export default class Workflow {

  constructor(_id) {
    this._id = _id;
    this._doc = this._getDoc();
  }

  refreshStatus() {
    const newStatus = this._getStatus();
    this._updateStatus(newStatus);
  }

  _getStatus() {
    const workflowType = this._getWorkflowType();

    if (workflowType === WorkflowTypes.THREE_STEP) {
      return this._getThreeStepStatus();
    } else if (workflowType === WorkflowTypes.SIX_STEP) {
      return this._getSixStepStatus();
    }
  }

  _updateStatus(status) {
    const { status:savedStatus } = this._doc;

    if (savedStatus !== status) {
      this.constructor._collection().update({
        _id: this._id
      }, {
        $set: { status }
      });
    }
  }

  _getDoc() {
    return this.constructor._collection().findOne({ _id: this._id });
  }

  _getThreeStepStatus() {
    // Implement in child class
  }

  _getSixStepStatus() {
    // Implement in child class
  }

  _getWorkflowType() {
    // Implement in child class
  }

  static _collection() {
    // Implement in child class
  }

}
