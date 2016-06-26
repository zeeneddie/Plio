import { Template } from 'meteor/templating';


Template.Actions_CompletionTargetDate.viewmodel({
  completionTargetDate: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Completion - target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date } = viewmodel.getData();

    if (date === this.templateInstance.data.completionTargetDate) {
      return;
    }

    this.completionTargetDate(date);

    this.parent().update({ completionTargetDate: date });
  },
  getData() {
    return { completionTargetDate: this.completionTargetDate() };
  }
});
