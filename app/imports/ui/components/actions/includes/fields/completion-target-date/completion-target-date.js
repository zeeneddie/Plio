import { Template } from 'meteor/templating';


Template.Actions_CompletionTargetDate.viewmodel({
  completionTargetDate: '',
  defaultDate: false,
  placeholder: 'Completion - target date',
  enabled: true,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const date = viewmodel.getData().date || '';

    if (date === this.templateInstance.data.completionTargetDate) {
      return;
    }

    this.completionTargetDate(date);

    this.parent().update && this.parent().update({ completionTargetDate: date });
  },
  getData() {
    return { completionTargetDate: this.completionTargetDate() };
  }
});
