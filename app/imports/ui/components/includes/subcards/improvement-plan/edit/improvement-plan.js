import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';
import { insert, update } from '/imports/api/improvement-plans/methods.js';

Template.Subcards_ImprovementPlan_Edit.viewmodel({
  mixin: ['collapse', 'modal'],
  autorun() {
    this.load(this.doc());
  },
  documentId: '',
  documentType: '',
  label: 'Improvement plan',
  _id: '',
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  reviewDates: [],
  files: [],
  isTextPresent() {
    return this.desiredOutcome() || this.files().length;
  },
  getTextIndicator() {
    return this.isTextPresent() ? '<i class="fa fa-align-left disclosure-indicator pull-right"></i>' : '';
  },
  doc() {
    return ImprovementPlans.findOne({ documentId: this.documentId() });
  },
  insert({ ...args }, cb) {
    const documentId = this.documentId();
    const documentType = this.documentType();

    this.modal().callMethod(insert, { documentId, documentType, ...args }, cb);
  },
  update({ query = {}, options = {}, ...args }, cb) {
    if (!this.doc()) {
      return this.insert({ ...args }, cb);
    }

    const _id = this.doc() && this.doc()._id;

    const allArgs = { ...args, _id, options, query };

    this.modal().callMethod(update, allArgs, cb);
  }
});
