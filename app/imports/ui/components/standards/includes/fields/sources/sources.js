import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.ESSources.viewmodel({
  mixin: ['organization'],
  update(args, cb) {
    this.parent().update(args, cb);
  },
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      standardId: this.parent().standardId(),
    };
  },
  callDocxRender(url, fileObj, cb) {
    Meteor.call('Mammoth.convertStandardFileToHtml', {
      fileUrl: url,
      htmlFileName: `${fileObj.name}.html`,
      source: `source${this.id()}`,
      standardId: this.parent()._id(),
    }, cb);
  },
});
