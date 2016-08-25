import { Template } from 'meteor/templating';

Template.RCA_UOS_Edit.viewmodel({
  mixin: 'utils',
  label: 'Update of standard(s)',
  updateOfStandards: '',
  methods: {},
  update(...args) {
    this.parent().update(...args);
  },
  onCommentsUpdate() {
    return ({ completionComments }, cb) => this.update({ 'updateOfStandards.completionComments': completionComments }, cb);
  }
});
