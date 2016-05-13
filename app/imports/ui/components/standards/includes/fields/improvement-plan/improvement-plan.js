import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESImprovementPlan.viewmodel({
  mixin: 'collapse',
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  selectedMetric: '',
  currentValue: '',
  targetValue: '',
  update({ ...args }, options) {
    const key = _.keys(args)[0];
    const value = _.values(args)[0];
    if (!options) {
      const options = {};

      options[`improvementPlan.${key}`] = value;
      this.parent().update(options);
    } else {
      this.parent().update({ query: { ...args } }, options);
    }
  }
});
