import { Meteor } from 'meteor/meteor';

import { NonConformities } from './non-conformities.js';
import { Organizations } from '../organizations/organizations.js';
import { Actions } from '../actions/actions.js';
import { generateSerialNumber } from '/imports/core/utils.js';
import NCWorkflow from './NCWorkflow.js';


export default {
  collection: NonConformities,

  insert({ organizationId, magnitude, ...args }) {
    const organization = Organizations.findOne({ _id: organizationId });
    if (!organization) {
      throw new Meteor.Error(400, 'Organization does not exist');
    }

    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `NC${serialNumber}`;

    const workflowType = organization.workflowType(magnitude);

    const NCId = this.collection.insert({
      organizationId, serialNumber, sequentialId,
      workflowType, magnitude, ...args
    });

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(NCId).refreshStatus();
    });

    return NCId;
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

  setAnalysisTargetDate({ _id, targetDate }) {
    const NC = this._getNC(_id);

    if (NC.isAnalysisCompleted()) {
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

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

    return ret;
  },

  completeAnalysis({ _id, userId }) {
    const NC = this._getNC(_id);
    const { analysis } = NC;
    const { executor } = analysis;

    if (userId !== executor) {
      throw new Meteor.Error(
        400, 'You cannot complete this root cause analysis'
      );
    }

    if (NC.isAnalysisCompleted()) {
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

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

    return ret;
  },

  undoAnalysis({ _id, userId }) {
    const NC = this._getNC(_id);
    const { analysis } = NC;
    const { executor } = analysis;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot undo this root cause analysis');
    }

    if (!NC.isAnalysisCompleted()) {
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

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

    return ret;
  },

  updateStandards({ _id, userId }) {
    const NC = this._getNC(_id);
    const { updateOfStandards } = NC;
    const { executor } = updateOfStandards;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot update standards');
    }

    if (NC.areStandardsUpdated()) {
      throw new Meteor.Error(400, 'Standards are already updated');
    }

    const actionsLength = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false
    }).count();

    if (actionsLength === 0) {
      throw new Meteor.Error(
        400, 'At least one action must be created before standards can be updated'
      );
    }

    const verifiedLength = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false,
      isVerified: true,
      verifiedAt: { $exists: true },
      verifiedBy: { $exists: true }
    }).count();

    if (actionsLength !== verifiedLength) {
      throw new Meteor.Error(
        400, 'All actions must be verified before standards can be updated'
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

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

    return ret;
  },

  undoStandardsUpdate({ _id, userId }) {
    const NC = this._getNC(_id);
    const { updateOfStandards } = NC;
    const { executor } = updateOfStandards;

    if (userId !== executor) {
      throw new Meteor.Error(400, 'You cannot undo update of standards');
    }

    if (!NC.areStandardsUpdated()) {
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

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

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
    let ret;

    if (isDeleted) {
      ret = this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      ret = this.collection.update(query, options);
    }

    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });

    return ret;
  },

  _getNC(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
    return NC;
  }
};
