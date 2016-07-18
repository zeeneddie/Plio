import { Template } from 'meteor/templating';

import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';

Template.Subcards_ImprovementPlan_Read.viewmodel({
  mixin: ['user', 'date'],
  autorun() {
    this.load(this.document());
  },
  documentId: '',
  documentType: '',
  _heading: 'Improvement plan',
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  reviewDates: [],
  files: [],
  document() {
    return ImprovementPlans.findOne({ documentId: this.documentId() });
  },
  IPHasFields({ desiredOutcome, targetDate, reviewDates, owner, files }) {
    return desiredOutcome || targetDate || owner || ( reviewDates && reviewDates.length > 0 ) || ( files && files.length );
  },
  renderReviewDates(dates) {
    return dates.map(doc => this.renderDate(doc.date)).join(', ');
  },
});
