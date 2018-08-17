import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/share/constants.js';

Template.Subcards_Analysis_Read_Item.viewmodel({
  mixin: ['user', 'date', 'utils'],
  getAnalysisStatusName(status = 0) {
    return AnalysisStatuses[status];
  },
});
