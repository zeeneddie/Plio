import { Meteor } from 'meteor/meteor';

import { NonConformities } from './non-conformities.js';
import { Organizations } from '../organizations/organizations.js';
import { generateSerialNumber } from '/imports/core/utils.js';
import WorkflowService from '../workflow/workflow-service.js';


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

    Meteor.isServer && Meteor.defer(() => WorkflowService.onNCCreated(NCId));

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
      WorkflowService.onNCAnalysisDateChanged(_id)
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
      WorkflowService.onNCAnalysisCompleted(_id)
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

      return this.collection.update(query, options);
    }
  },

  _getNC(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
    return NC;
  }
};
