import { Template } from 'meteor/templating';

Template.Subcards_RiskScoring_Read.viewmodel({
  mixin: ['riskScore', 'date', 'user'],
  scores: [],
  scoresSorted() {
    return this.sortScores(this.scores(), 1);
  },
});
