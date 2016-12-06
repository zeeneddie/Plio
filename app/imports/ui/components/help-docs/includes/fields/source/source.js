import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations';

Template.HelpDocs_Source_Edit.viewmodel({
  update(args, cb) {
    this.parent().update(args, cb);
  },
  uploaderMetaContext() {
    return {
      helpDocId: this.parent()._id(),
    };
  },
  fileData() {
    const { _id } = Organizations.findOne({ isAdminOrg: true }) || {};
    return { organizationId: _id };
  },
  convertDocxToHtml(url, fileObj, cb) {
    Meteor.call('Mammoth.convertHelpDocFileToHtml', {
      fileUrl: url,
      htmlFileName: `${fileObj.name}.html`,
      helpDocId: this.parent()._id(),
    }, cb);
  },
});
