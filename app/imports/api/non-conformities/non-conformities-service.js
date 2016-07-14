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
