import { Template } from 'meteor/templating';

Template.Subcards_RiskAnalysis_Read.viewmodel({
  mixin: ['riskScore', 'date', 'user'],
  score: ''
});
