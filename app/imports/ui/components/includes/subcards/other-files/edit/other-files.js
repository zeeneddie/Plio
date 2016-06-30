import { Template } from 'meteor/templating';

Template.Subcards_OtherFiles_Edit.viewmodel({
  mixin: 'organization',
  files: [],
  uploaderMetaContext: {},
  slingshotDirective: '',
  update(...args) {
    this.parent().update(...args);
  }
});
