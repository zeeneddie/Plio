import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import get from 'lodash.get';

import { Files } from '/imports/share/collections/files';
import { Helps } from '/imports/share/collections/helps';
import { HelpsListProjection } from '/imports/api/constants';
import { getPublishCompositeOrganizationUsers } from '../../helpers';
import { isOrgMember } from '../../checkers.js';


Meteor.publishComposite(
  'helpsLayout',
  getPublishCompositeOrganizationUsers(function getHelpsLayoutData() {
    return [{
      find({ _id: organizationId }) {
        return Helps.find({ organizationId }, { fields: HelpsListProjection });
      },
    }];
  })
);

Meteor.publishComposite('helpCard', function getHelpCardData(helpId) {
  check(helpId, String);

  const userId = this.userId;
  const cursor = Helps.find({ _id: helpId });
  const { organizationId } = cursor.fetch()[0] || {};

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return {
    find() { return cursor; },
    children: [{
      find(help) {
        const fileId = get(help, 'source.fileId');
        return Files.find({ _id: fileId });
      },
    }],
  };
});
