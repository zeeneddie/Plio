import { Template } from 'meteor/templating';

import Analysis from '../../../../../../react/fields/edit/components/Analysis';

Template.Analysis_Edit.viewmodel({
  mixin: 'utils',
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  methods: {},
  Status() {
    return Analysis.Status;
  },
});
