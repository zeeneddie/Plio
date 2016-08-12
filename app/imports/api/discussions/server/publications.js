import { Meteor } from 'meteor/meteor';

import { Discussions } from '../discussions.js';
import { Standards } from '/imports/api/standards/standards.js'
import { isOrgMember } from '../../checkers.js';


Meteor.publish('discussionsByStandardId', function(standardId) {
  const userId = this.userId;
  const standard = Standards.findOne({ _id: standardId });

  if (standard && !userId || !isOrgMember(userId, standard.organizationId)) {
    return this.ready();
  }
  
  const query = { documentType: 'standard', linkedTo: standardId };
  const options = { fields: { _id: 1, documentType: 1, linkedTo: 1 } };

  return Discussions.find(query, options);
});
