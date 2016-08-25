import { Template } from 'meteor/templating';

Template.RCA_Analysis_Edit.viewmodel({
  mixin: 'utils',
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  methods: {},
  update(...args) {
    this.parent().update(...args);
  },
  onCommentsUpdate() {
    return ({ completionComments }, cb) => this.update({ 'analysis.completionComments': completionComments }, cb);
  }
});
