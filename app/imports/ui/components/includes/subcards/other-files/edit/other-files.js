import { Template } from 'meteor/templating';

Template.Subcards_OtherFiles_Edit.viewmodel({
  mixin: 'organization',
  label: 'Other files',
  files: [],
  uploaderMetaContext: {},
  slingshotDirective: '',
  update(...args) {
    this.parent().update(...args);
  }
});
