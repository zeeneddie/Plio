import { Template } from 'meteor/templating';

Template.NCOtherFiles.viewmodel({
  mixin: 'organization',
  files: [],
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      nonConformityId: this._id()
    };
  },
  update(...args) {
    this.parent().update(...args);
  }
});
