import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';
import { insert, update } from '/imports/api/improvement-plans/methods.js';

Template.ESImprovementPlan.viewmodel({
  mixin: ['collapse', 'modal'],
  autorun() {
    const _id = this.standard() && this.standard()._id;

    this.templateInstance.subscribe('improvementPlans', _id);

    console.log(this.improvementPlan());
  },
  improvementPlan() {
    return ImprovementPlans.findOne({});
  },
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  reviewDates: '',
  selectedMetric: '',
  currentValue: '',
  targetValue: '',
  files: [],
  insert({ ...args }, cb) {
    const standardId = this.standard() && this.standard()._id;
    
    this.modal().callMethod(insert, { standardId, ...args }, cb);
  },
  update({ _id, ...args }) {
    if (!this.improvementPlan()) {
      return this.insert({ ...args });
    }
  }
  // update({ ...args }, options) {
  //   const key = _.keys(args)[0];
  //   const value = _.values(args)[0];
  //   if (!options) {
  //     const options = {};
  //
  //     options[`improvementPlan.${key}`] = value;
  //     this.parent().update(options);
  //   } else {
  //     this.parent().update({ query: { ...args } }, options);
  //   }
  // }
});
