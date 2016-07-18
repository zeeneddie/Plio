import { Template } from 'meteor/templating';

Template.RiskScoring_ScoredBy_Edit.viewmodel({
  mixin: ['members', 'search', 'user'],
  scoredBy: '',
  label: 'Scored by',
  placeholder: 'Scored by',
  selectFirstIfNoSelected: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:scoredBy } = viewmodel.getData();

    if (this.templateInstance.data.scoredBy === scoredBy) return;

    this.scoredBy(scoredBy);

    this.parent().update({ scoredBy });
  }
});
