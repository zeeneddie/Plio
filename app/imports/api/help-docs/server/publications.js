import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import get from 'lodash.get';

import { Files } from '/imports/share/collections/files';
import { HelpDocs } from '/imports/share/collections/help-docs';
import { HelpSections } from '/imports/share/collections/help-sections';
import {
  HelpsListProjection,
  HelpSectionProjection,
} from '/imports/api/constants';
import { getUserOrganizations } from '../../organizations/utils';


Meteor.publishComposite('helpDocsLayout', function getHelpDocsLayoutData() {
  if (!this.userId) {
    return this.ready();
  }

  return [
    {
      find() {
        return HelpDocs.find({}, { fields: HelpsListProjection });
      },
    },
    {
      find() {
        return HelpSections.find({}, { fields: HelpSectionProjection });
      },
    },
    {
      find() {
        return getUserOrganizations(this.userId, {
          isAdminOrg: true,
        }, {
          fields: {
            isAdminOrg: 1,
            'users.userId': 1,
            'users.isRemoved': 1,
            'users.removedAt': 1,
            'users.removedBy': 1,
          },
        });
      },
      children: [{
        find(org) {
          const usersIds = org.users
            .filter(userData => !userData.isRemoved)
            .map(userData => userData.userId);

          return Meteor.users.find({
            _id: { $in: usersIds },
          }, {
            fields: {
              'emails.address': 1,
              'profile.firstName': 1,
              'profile.lastName': 1,
            },
          });
        },
      }],
    },
  ];
});

Meteor.publishComposite('helpCard', function getHelpCardData(helpId) {
  check(helpId, String);

  if (!this.userId) {
    return this.ready();
  }

  return {
    find() {
      return HelpDocs.find({ _id: helpId });
    },
    children: [{
      find(help) {
        const fileId = get(help, 'source.fileId');
        return Files.find({ _id: fileId });
      },
    }],
  };
});
