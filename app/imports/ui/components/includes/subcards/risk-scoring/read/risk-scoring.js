import { Template } from 'meteor/templating';

Template.Subcards_RiskScoring_Read.viewmodel({
  mixin: ['riskScore', 'date', 'user'],
  scores: [],
  scoresSorted() {
    return Array.from(this.scores() || []).sort(({ scoredAt:sc1 }, { scoredAt:sc2 }) => sc1 - sc2); // Asc
  }
});
