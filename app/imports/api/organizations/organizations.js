import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from './organization-schema.js';
import { UserMembership } from '../constants';


const Organizations = new Mongo.Collection('Organizations');
Organizations.attachSchema(OrganizationSchema);

Organizations.helpers({
  ownerId() {
    const ownerDoc = _.find(this.users, (doc) => {
      return doc.role === UserMembership.ORG_OWNER
    });

    return ownerDoc ? ownerDoc.userId : null;
  }
});

export { Organizations };
