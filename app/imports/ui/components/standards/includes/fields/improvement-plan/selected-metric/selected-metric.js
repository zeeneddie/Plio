import { Template } from 'meteor/templating';

Template.ESIPSelectedMetric.viewmodel({
  mixin: ['modal', 'clearableField'],
  selectedMetric: '',
  update() {
    this.callWithFocusCheck(() => {
      const { selectedMetric } = this.getData();
      this.parent().update({ selectedMetric });
    });
  },
  getData() {
    const { selectedMetric } = this.data();
    return { selectedMetric };
  }
});
