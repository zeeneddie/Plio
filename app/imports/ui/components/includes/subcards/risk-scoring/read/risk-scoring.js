import { Template } from 'meteor/templating';

Template.Subcards_RiskScoring_Read.viewmodel({
  mixin: ['riskScore', 'date', 'user'],
  score: ''
});
