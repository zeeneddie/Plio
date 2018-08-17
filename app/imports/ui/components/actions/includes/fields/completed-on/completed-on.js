import { Template } from 'meteor/templating';


Template.Actions_CompletedOn.viewmodel({
  completedAt: '',
  defaultDate: false,
  placeholder: 'Completed on',
  enabled: true,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const date = viewmodel.getData().date || '';

    if (date === this.templateInstance.data.completedAt) {
      return;
    }

    this.completedAt(date);

    this.parent().update && this.parent().update({ completedAt: date });
  },
  getData() {
    return { completedAt: this.completedAt() };
  },
});
