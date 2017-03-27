import { Meteor } from 'meteor/meteor';

import { Files } from '/imports/share/collections/files.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('fileById', function (fileId) {
  const userId = this.userId;

  const cursor = Files.find({ _id: fileId });

  const { organizationId } = Object.assign({}, cursor.fetch()[0]);

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return cursor;
});
