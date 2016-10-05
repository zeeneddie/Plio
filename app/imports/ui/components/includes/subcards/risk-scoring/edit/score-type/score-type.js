import { Template } from 'meteor/templating';

import { riskScoreTypes } from '/imports/api/constants.js';

Template.RiskScoring_ScoreType_Edit.viewmodel({
  mixin: 'utils',
  scoreTypeId: '',
  label: 'Score type',
  placeholder: 'Score type',
  disabled: false,
  types() {
    return _.values(riskScoreTypes);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update() {
    const { scoreTypeId } = this.getData();

    if (this.templateInstance.data.scoreTypeId === scoreTypeId) return;

    this.scoreTypeId(scoreTypeId);
    this.parent().update({ scoreTypeId });
  },
  getData() {
    const { scoreTypeId } = this.data();
    return { scoreTypeId };
  }
});
