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


Meteor.publish('helpDocsLayout', function getHelpDocsLayoutData() {
  if (!this.userId) {
    return this.ready();
  }

  return [
    HelpDocs.find({}, { fields: HelpsListProjection }),
    HelpSections.find({}, { fields: HelpSectionProjection }),
    getUserOrganizations(this.userId, {}, {
      fields: {
        isAdminOrg: 1,
        'users.userId': 1,
        'users.isRemoved': 1,
        'users.removedAt': 1,
        'users.removedBy': 1,
      },
    }),
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
