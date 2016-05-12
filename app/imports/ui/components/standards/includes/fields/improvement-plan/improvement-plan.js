import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESImprovementPlan.viewmodel({
  mixin: ['collapse', 'addForm'],
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  selectedMetric: '',
  targetValue: '',
  update({ ...args }) {
    const key = _.keys(args)[0];
    const value = _.values(args)[0];
    const options = {};

    options[`improvementPlan.${key}`] = value;

    this.parent().update(options);
  },
  getData() {
    const { date:targetDate } = this.child('Datepicker', vm => vm.name && vm.name() === 'targetDate').getData();
    const { desiredOutcome } = this.data();

    return { desiredOutcome, targetDate };
  }
});
