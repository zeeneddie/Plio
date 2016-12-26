import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { OrganizationSchema } from '../schemas/organization-schema.js';
import { UserMembership, ProblemMagnitudes } from '../constants';


const Organizations = new Mongo.Collection(CollectionNames.ORGANIZATIONS);

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
  },
  workflowStepTime(problemMagnitude) {
    const keyMapping = {
      [ProblemMagnitudes.MINOR]: 'minorProblem',
      [ProblemMagnitudes.MAJOR]: 'majorProblem',
      [ProblemMagnitudes.CRITICAL]: 'criticalProblem'
    };

    return this.workflowDefaults[keyMapping[problemMagnitude]].stepTime;
  },
  getMemberIds() {
    const members = this.users || [];
    const memberIds = _.map(members, (member) => {
      if (!member.isRemoved) {
        return member.userId;
      }
    });

    return memberIds;
  }
});

export { Organizations };
