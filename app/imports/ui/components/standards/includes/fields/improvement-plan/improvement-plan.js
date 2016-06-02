import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';
import { insert, update } from '/imports/api/improvement-plans/methods.js';

Template.ESImprovementPlan.viewmodel({
  mixin: ['collapse', 'modal', 'standard'],
  autorun() {
    this.load(this.improvementPlan());
  },
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  reviewDates: '',
  files: [],
  isTextPresent() {
    return this.desiredOutcome() || this.files().length;
  },
  improvementPlan() {
    return ImprovementPlans.findOne({ documentId: this.standardId() });
  },
  insert({ ...args }, cb) {
    const documentId = this.standardId();
    const documentType = 'standard';

    this.modal().callMethod(insert, { documentId, documentType, ...args }, cb);
  },
  update({ query = {}, ...args }, options = {}, cb) {
    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }

    if (!this.improvementPlan()) {
      return this.insert({ ...args });
    }

    const _id = this.improvementPlan() && this.improvementPlan()._id;

    const modifier = { ...args, _id, options, query };

    this.modal().callMethod(update, modifier, cb);
  }
});
