import { Template } from 'meteor/templating';

Template.ESIPSelectedMetric.viewmodel({
  mixin: 'callWithFocusCheck',
  selectedMetric: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { selectedMetric } = this.getData();
      this.parent().update({ selectedMetric });
    });
  },
  getData() {
    const { selectedMetric } = this.data();
    return { selectedMetric };
  }
});
