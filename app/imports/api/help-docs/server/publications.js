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


Meteor.publish('helpDocsLayout', function getHelpDocsLayoutData() {
  if (!this.userId) {
    return this.ready();
  }

  return [
    HelpDocs.find({}, { fields: HelpsListProjection }),
    HelpSections.find({}, { fields: HelpSectionProjection }),
  ];
});

Meteor.publishComposite('helpCard', function getHelpCardData(helpId) {
  check(helpId, String);

  if (!this.userId) {
    return this.ready();
  }

  return {
    find() {
      return HelpDocs.find();
    },
    children: [{
      find(help) {
        const fileId = get(help, 'source.fileId');
        return Files.find({ _id: fileId });
      },
    }],
  };
});
