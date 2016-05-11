import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESImprovementPlan.viewmodel({
  mixin: ['collapse', 'addForm', 'date'],
  desiredOutcome: '',
  targetDate: '',
  selectedMetric: '',
  targetValue: '',
  update(field) {
    const value = this.getData()[field];
    const options = {};

    options[`improvementPlan.${field}`] = value;

    this.parent().update(options);
  },
  getData() {
    const { date:targetDate } = this.child('Datepicker', vm => vm.name && vm.name() === 'targetDate').getData();
    const { desiredOutcome } = this.data();

    return { desiredOutcome, targetDate };
  }
});
