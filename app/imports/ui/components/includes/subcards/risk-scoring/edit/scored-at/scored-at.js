import { Template } from 'meteor/templating';

Template.RiskScoring_ScoredAt_Edit.viewmodel({
  scoredAt: '',
  label: 'Date',
  placeholder: 'Date',
  defaultDate: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:scoredAt } = viewmodel.getData();

    if (this.templateInstance.data.scoredAt === scoredAt) return;

    this.scoredAt(scoredAt);

    this.parent().update({ scoredAt });
  }
});
