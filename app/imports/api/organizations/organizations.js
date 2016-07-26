import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from './organization-schema.js';
import { UserMembership, ProblemMagnitudes } from '../constants';


const Organizations = new Mongo.Collection('Organizations');
Organizations.attachSchema(OrganizationSchema);

Organizations.helpers({
  ownerId() {
    const ownerDoc = _.find(this.users, (doc) => {
      return doc.role === UserMembership.ORG_OWNER
    });

    return ownerDoc ? ownerDoc.userId : null;
  },
  workflowType(problemMagnitude) {
    const keyMapping = {
      [ProblemMagnitudes.MINOR]: 'minorProblem',
      [ProblemMagnitudes.MAJOR]: 'majorProblem',
      [ProblemMagnitudes.CRITICAL]: 'criticalProblem'
    };

    return this.workflowDefaults[keyMapping[problemMagnitude]].workflowType;
  }
});

export { Organizations };
