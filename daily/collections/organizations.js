import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from '../schemas/organization-schema';
import { UserMembership, ProblemMagnitudes, CollectionNames } from '../constants';


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
  },
});

Organizations.listFields = {
  name: 1,
  serialNumber: 1,
  createdAt: 1,
  customerType: 1,
  isAdminOrg: 1,
  lastAccessedDate: 1,
  'users.userId': 1,
  'users.role': 1,
  'users.isRemoved': 1,
  'users.removedAt': 1,
  'users.removedBy': 1,
};

Organizations.cardFields = {
  ...Organizations.listFields,
  timezone: 1,
  currency: 1,
};

export { Organizations };
