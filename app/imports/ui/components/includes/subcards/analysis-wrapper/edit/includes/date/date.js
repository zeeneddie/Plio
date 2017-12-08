import { Template } from 'meteor/templating';

Template.Analysis_TargetDate_Edit.viewmodel({
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
      const currentDate = this.templateInstance.data.date;
      const { date } = viewmodel.getData();

      if (Object.is(date, currentDate)) return;

      this.date(date);

      this.onUpdate({ date }, err => err && this.date(currentDate) && false);
    };
  },
  getData() {
    const { date } = this.data();
    return { date };
  },
});
