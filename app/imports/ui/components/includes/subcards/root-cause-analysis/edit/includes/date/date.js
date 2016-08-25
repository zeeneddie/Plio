import { Template } from 'meteor/templating';

Template.RCA_TargetDate_Edit.viewmodel({
  mixin: 'utils',
  date: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Target date',
  label: 'Target date',
  disabled: false,
  onUpdate() {},
  update() {
    return (viewmodel) => {
      const { date } = viewmodel.getData();

      if (date === this.templateInstance.data.date) return;

      this.date(date);

      this.onUpdate({ date });
    };
  },
  getData() {
    const { date } = this.data();
    return { date };
  }
});
