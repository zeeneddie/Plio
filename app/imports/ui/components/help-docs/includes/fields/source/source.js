import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.HelpDocs_Source_Edit.viewmodel({
  update(args, cb) {
    this.parent().update(args, cb);
  },
  uploaderMetaContext() {
    return {
      helpDocId: this.parent()._id(),
    };
  },
  callDocxRender(url, fileObj, cb) {
    Meteor.call('Mammoth.convertHelpDocFileToHtml', {
      fileUrl: url,
      htmlFileName: `${fileObj.name}.html`,
      helpDocId: this.parent()._id(),
    }, cb);
  },
});
