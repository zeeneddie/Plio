import { Meteor } from 'meteor/meteor';

import { Organizations } from '../organizations/organizations.js';
import { Actions } from '../actions/actions.js';
import Utils from '/imports/core/utils.js';


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

  setAnalysisDate({ _id, targetDate }) {
    const doc = this._getDoc(_id);

    if (doc.isAnalysisCompleted()) {
      throw new Meteor.Error(
        400,
        'Cannot set target date for completed root cause analysis'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: { 'analysis.targetDate': targetDate }
    });

    this._refreshStatus(_id);

    return ret;
  },

  completeAnalysis({ _id, userId }) {
    const doc = this._getDoc(_id);
    const { analysis } = doc;
    const { executor } = analysis;

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
        'analysis.completedBy': userId
      }
    });

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
        'analysis.completedBy': ''
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  updateStandards({ _id, userId }) {
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
        'updateOfStandards.completedBy': userId
      }
    });

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
        'updateOfStandards.completedBy': ''
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId
      }
    };

    return this.collection.update(query, options);
  },

  remove({ _id, deletedBy, isDeleted }) {
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
  }

};
