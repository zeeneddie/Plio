import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.Subcards_RootCauseAnalysis_Read.viewmodel({
  mixin: ['user', 'date'],
  analysis: '',
  getAnalysisStatusName(status) {
    return AnalysisStatuses[status];
  },
  has(obj, ...args) {
    return _.has(obj, ...args.splice(0, args.length - 1));
  }
});
