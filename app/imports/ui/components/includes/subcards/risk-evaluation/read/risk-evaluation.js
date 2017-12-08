import { Template } from 'meteor/templating';

Template.Subcards_RiskEvaluation_Read.viewmodel({
  mixin: 'utils',
  riskEvaluation: '',
  hasFields() {
    return !_(this.riskEvaluation()).isEmpty();
  },
});
