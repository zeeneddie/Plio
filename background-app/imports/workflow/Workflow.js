import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { WorkflowTypes } from '../share/constants';
import { Organizations } from '../share/collections';

export default class Workflow {
  constructor(id) {
    if (!SimpleSchema.RegEx.Id.test(id)) {
      throw new Error(`${JSON.stringify(id)} is not valid document ID`);
    }

    this._id = id;
  }

  _prepare() {
    this._doc = this._getDoc();
    this._timezone = this._getOrgTimezone();
  }

  refreshStatus() {
    this._prepare();

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

    return undefined;
  }

  _updateStatus(status) {
    const { status: savedStatus } = this._doc;

    if (savedStatus !== status) {
      this.constructor._collection.update({
        _id: this._id,
      }, {
        $set: { status },
      });
    }

    this._onUpdateStatus(status);
  }

  _onUpdateStatus() {
    // Implement in child class
  }

  _getDoc() {
    const doc = this.constructor._collection.findOne({ _id: this._id });
    if (!doc) {
      throw new Error(`Document with ID ${this._id} does not exist`);
    }

    return doc;
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
    const { organizationId: _id } = this._doc;
    const { timezone } = Organizations.findOne({ _id }) || {};
    return timezone || 'UTC';
  }

  static get _collection() {
    // Implement in child class
    return undefined;
  }

  static get _docType() {
    // Implement in child class
    return undefined;
  }
}
