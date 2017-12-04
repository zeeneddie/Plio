import { Template } from 'meteor/templating';

Template.Subcards_OtherFiles_Edit.viewmodel({
  mixin: 'organization',
  label: 'Other files',
  fileIds: [],
  uploaderMetaContext: {},
  slingshotDirective: '',
  update(...args) {
    this.parent().update(...args);
  },
});
