import { Meteor } from 'meteor/meteor';

import { Organizations } from '../organizations/organizations.js';
import { Risks } from './risks.js';
import { generateSerialNumber } from '/imports/core/utils.js';
import WorkflowService from '../workflow/workflow-service.js';


export default {
  collection: Risks,

  insert({ organizationId, magnitude, ...args }) {
    const organization = Organizations.findOne({ _id: organizationId });
    if (!organization) {
      throw new Meteor.Error(400, 'Organization does not exist');
    }

    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `RK${serialNumber}`;

    const workflowType = organization.workflowType(magnitude);

    const riskId = this.collection.insert({
      organizationId, serialNumber, sequentialId,
      magnitude, workflowType, ...args
    });

    Meteor.isServer && Meteor.defer(() => WorkflowService.onRiskCreated(riskId));

    return riskId;
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
  }
};
