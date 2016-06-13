import { Template } from 'meteor/templating';

Template.NCRCACompletedDate.viewmodel({
  completedAt: '',
  defaultDate: false,
  placeholder: 'Completed date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:completedAt } = viewmodel.getData();

    if (completedAt === this.templateInstance.data.completedAt) return;

    this.completedAt(completedAt);

    this.parent().update({ 'analysis.completedAt': completedAt });
  },
  getData() {
    const { completedAt } = this.data();
    return { completedAt };
  }
});
