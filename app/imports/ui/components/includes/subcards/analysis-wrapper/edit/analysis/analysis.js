import { Template } from 'meteor/templating';

Template.Analysis_Edit.viewmodel({
  mixin: 'utils',
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  methods: {},
});
