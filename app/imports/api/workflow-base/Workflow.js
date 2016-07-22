import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { WorkflowTypes } from '../constants.js';


export default class Workflow {

  constructor(idOrDoc) {
    const isId = SimpleSchema.RegEx.Id.test(idOrDoc);
    const isDoc = _.isObject(idOrDoc);

    if (!(isId || isDoc)) {
      throw new Error('Invalid argument for Workflow constructor');
    }

    if (isId) {
      this._id = idOrDoc;
      this._doc = this._getDoc();
    } else {
      this._doc = idOrDoc;
      this._id = this._doc._id;
    }

    this._timezone = this._getOrgTimezone();
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

      this._onUpdateStatus(status);
    }
  }

  _onUpdateStatus(status) {
    // Implement in child class
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

  _getOrgTimezone() {
    const { organizationId:_id } = this._doc;
    const { timezone } = Organizations.findOne({ _id }) || {};
    return timezone || 'UTC';
  }

  static _collection() {
    // Implement in child class
  }

}
