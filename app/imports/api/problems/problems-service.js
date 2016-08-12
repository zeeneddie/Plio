import { Meteor } from 'meteor/meteor';

import { Organizations } from '../organizations/organizations.js';
import { Actions } from '../actions/actions.js';
import Utils from '/imports/core/utils.js';
import WorkItemService from '../work-items/work-item-service.js';
import { WorkItemsStore } from '../constants.js';


export default {

  insert({ organizationId, magnitude, ...args }) {
    const organization = Organizations.findOne({ _id: organizationId });
    if (!organization) {
      throw new Meteor.Error(400, 'Organization does not exist');
    }

    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `${this._abbr}${serialNumber}`;

    const workflowType = organization.workflowType(magnitude);

    const _id = this.collection.insert({
      organizationId, serialNumber, sequentialId,
      workflowType, magnitude, ...args
    });

    this._refreshStatus(_id);

    return _id;
  },

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  setAnalysisExecutor({ _id, executor }) {
    const doc = this._getDoc(_id);
    const { analysis = {}, ...rest } = doc;

    if (doc.isAnalysisCompleted()) {
      throw new Meteor.Error(
        400, 'Cannot set "Who will do it?" for completed analysis'
      );
    }

    const query = { _id };
    const options = { $set: { 'analysis.executor': executor } };

    const ret = this.collection.update(query, options);

    const WIType = WorkItemsStore.TYPES.COMPLETE_ANALYSIS;
    WorkItemService.connectedAnalysisUpdated(WIType, this._docType, { analysis: { ...analysis, executor }, ...rest }); // updated doc

    this._refreshStatus(_id);

    return ret;
  },

  setAnalysisDate({ _id, targetDate }) {
    const doc = this._getDoc(_id);
    const { analysis: { targetDate:td, ...analysis } = {}, ...rest } = doc;

    if (doc.isAnalysisCompleted()) {
      throw new Meteor.Error(
        400,
        'Cannot set target date for completed root cause analysis'
      );
    }

    const query = { _id };
    const options = { $set: { 'analysis.targetDate': targetDate } };

    const ret = this.collection.update(query, options);

    const WIType = WorkItemsStore.TYPES.COMPLETE_ANALYSIS;
    WorkItemService.connectedAnalysisUpdated(WIType, this._docType, { analysis: { targetDate, ...analysis }, ...rest }); // updated doc

    this._refreshStatus(_id);

    return ret;
  },

  completeAnalysis({ _id, completionComments, userId }) {
    const doc = this._getDoc(_id);
    const { analysis: { executor } = {} } = doc;

    if (userId !== executor) {
      throw new Meteor.Error(
        400, 'You cannot complete this root cause analysis'
      );
    }

    if (doc.isAnalysisCompleted()) {
      throw new Meteor.Error(
        400, 'This root cause analysis is already completed'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'analysis.status': 1, // Completed
        'analysis.completedAt': new Date(),
        'analysis.completedBy': userId,
        'analysis.completionComments': completionComments
      }
    });

    WorkItemService.analysisCompleted(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  undoAnalysis({ _id, userId }) {
    const doc = this._getDoc(_id);
    const { analysis } = doc;
    const { executor } = analysis;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot undo this root cause analysis');
    }

    if (!doc.isAnalysisCompleted()) {
      throw new Meteor.Error(400, 'This root cause analysis is not completed');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: { 'analysis.status': 0 }, // Not completed
      $unset: {
        'analysis.completedAt': '',
        'analysis.completedBy': '',
        'analysis.completionComments': ''
      }
    });

    WorkItemService.analysisCanceled(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  updateStandards({ _id, completionComments, userId }) {
    const doc = this._getDoc(_id);
    const { updateOfStandards } = doc;
    const { executor } = updateOfStandards;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot update standards');
    }

    if (doc.areStandardsUpdated()) {
      throw new Meteor.Error(400, 'Standards are already updated');
    }

    const actionsLength = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false
    }).count();

    if (actionsLength === 0) {
      throw new Meteor.Error(
        400,
        'At least one action must be created before standards can be updated'
      );
    }

    const verifiedLength = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false,
      isVerified: true,
      isVerifiedAsEffective: true,
      verifiedAt: { $exists: true },
      verifiedBy: { $exists: true }
    }).count();

    if (actionsLength !== verifiedLength) {
      throw new Meteor.Error(
        400,
        'All actions must be verified as effective before standards can be updated'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'updateOfStandards.status': 1, // Completed
        'updateOfStandards.completedAt': new Date(),
        'updateOfStandards.completedBy': userId,
        'updateOfStandards.completionComments': completionComments
      }
    });

    WorkItemService.standardsUpdated(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  undoStandardsUpdate({ _id, userId }) {
    const doc = this._getDoc(_id);
    const { updateOfStandards } = doc;
    const { executor } = updateOfStandards;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot undo update of standards');
    }

    if (!doc.areStandardsUpdated()) {
      throw new Meteor.Error(400, 'Standards are not updated');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'updateOfStandards.status': 0 // Not completed
      },
      $unset: {
        'updateOfStandards.completedAt': '',
        'updateOfStandards.completedBy': '',
        'updateOfStandards.completionComments': ''
      }
    });

    WorkItemService.standardsUpdateCanceled(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateExecutor({ _id, executor }) {
    const doc = this._getDoc(_id);
    const { updateOfStandards = {}, ...rest } = doc;

    if (doc.areStandardsUpdated()) {
      throw new Meteor.Error(
        400, 'Cannot set "who will do it" for completed standards update'
      );
    }

    const query = { _id };
    const options = { $set: { 'updateOfStandards.executor': executor } };

    const ret = this.collection.update(query, options);

    const WIType = WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS;
    WorkItemService.connectedStandardsUpdated(WIType, this._docType, { updateOfStandards: { ...updateOfStandards, executor }, ...rest }); // updated doc

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateDate({ _id, targetDate }) {
    const doc = this._getDoc(_id);
    const { updateOfStandards: { targetDate:td, ...updateOfStandards } = {}, ...rest } = doc;

    if (doc.areStandardsUpdated()) {
      throw new Meteor.Error(
        400,
        'Cannot set target date for completed standards update'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: { 'updateOfStandards.targetDate': targetDate }
    });

    this._refreshStatus(_id);

    const WIType = WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS;
    WorkItemService.connectedStandardsUpdated(WIType, this._docType, { updateOfStandards: { targetDate, ...updateOfStandards }, ...rest }); // updated doc

    return ret;
  },

  updateViewedBy({ _id, viewedBy }) {
    this._getDoc(_id);

    const query = { _id };
    const options = {
      $addToSet: { viewedBy }
    };

    return this.collection.update(query, options);
  },

  remove({ _id, deletedBy }) {
    const { isDeleted } = this._getDoc(_id);

    const query = { _id };

    if (isDeleted) {
      return this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      const ret = this.collection.update(query, options);

      this._refreshStatus(_id);

      return ret;
    }
  },

  restore({ _id }) {
    const doc = this._getDoc(_id);

    if (!doc.deleted()) {
      throw new Meteor.Error(
        400, 'This document is not deleted so can not be restored'
      );
    }

    const query = { _id };
    const options = {
      $set: {
        isDeleted: false
      },
      $unset: {
        deletedBy: '',
        deletedAt: ''
      }
    };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  }
};
