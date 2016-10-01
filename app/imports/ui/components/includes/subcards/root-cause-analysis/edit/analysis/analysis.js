import { Template } from 'meteor/templating';

Template.RCA_Analysis_Edit.viewmodel({
  mixin: 'utils',
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  methods: {}
});
