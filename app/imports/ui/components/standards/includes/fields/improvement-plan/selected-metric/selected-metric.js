import { Template } from 'meteor/templating';

Template.ESIPSelectedMetric.viewmodel({
  selectedMetric: '',
  update() {
    const { selectedMetric } = this.getData();
    this.parent().update({ selectedMetric });
  },
  getData() {
    const { selectedMetric } = this.data();
    return { selectedMetric };
  }
});
