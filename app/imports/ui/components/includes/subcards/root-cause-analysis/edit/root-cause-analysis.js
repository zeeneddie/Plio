import { Template } from 'meteor/templating';

import { RCAMaxCauses } from '/imports/share/constants';
import { AnalysisFieldPrefixes } from '../../../../../../api/constants';

Template.Subcards_RootCauseAnalysis_Edit.viewmodel({
  mixin: ['collapse', 'modal'],
  doc() {
    return this.rootCauseAnalysis() || {};
  },
  label: 'Root cause analysis',
  prefix: AnalysisFieldPrefixes.CAUSE,
  causes() {
    return this.doc() && this.doc().causes || [];
  },
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
  },
});
