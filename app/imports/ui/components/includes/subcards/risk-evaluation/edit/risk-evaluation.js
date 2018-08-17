import { Template } from 'meteor/templating';
import { RisksHelp } from '/imports/api/help-messages';
import { chain } from '/imports/api/helpers';

Template.Subcards_RiskEvaluation_Edit.viewmodel({
  mixin: ['utils', 'modal'],
  autorun() {
    this.load(this.riskEvaluation());
  },
  riskEvaluation: '',
  comments: '',
  prevLossExp: '',
  priority: '',
  decision: '',
  decisionFieldHelp: RisksHelp.riskEvaluationTreatmentDecision,
  update({ ...args }, cb = () => {}) {
    const data = this.data();
    const _args = _.keys(args)
      .map(key => ({ [`riskEvaluation.${key}`]: args[key] }))
      .reduce((prev, cur) => ({ ...prev, ...cur }));

    this.parent().update(_args, cb);
  },
});
