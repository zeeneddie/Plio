import { Template } from 'meteor/templating';

import { RCAMaxCauses } from '/imports/api/constants.js';


Template.Subcards_RootCauseAnalysis_Edit.viewmodel({
  mixin: ['collapse', 'modal'],
  autorun() {
    this.load(this.doc());
  },
  doc() {
    return this.rootCauseAnalysis() || {};
  },
  label: 'Root cause analysis',
  causes: [],
  fileIds() {
    return this.doc() && this.doc().fileIds || [];
  },
  isTextPresent() {
    return !!_(this.causes()).find(cause => cause.text && !!cause.text.length);
  },
  getTextIndicator() {
    return this.isTextPresent() ? '<i class="fa fa-align-left disclosure-indicator pull-right"></i>' : '';
  },
  causesData() {
    const causes = this.causes();

    return _(RCAMaxCauses).times((n) => {
      const index = n + 1;
      const cause = causes.find(cause => cause.index === index);

      return cause ? { ...cause, isNew: false } : { index, text: '', isNew: true };
    });
  },
  update({ query = {}, options = {}, ...args }, cb) {
    this.parent().update({ query, options, ...args }, cb);
  }
});
