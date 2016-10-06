import { Template } from 'meteor/templating';

import { chain } from '/imports/api/helpers.js';

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
  update({ ...args }, cb = () => {}) {
    const data = this.data();
    const _args = _.keys(args)
                    .map(key => ({ [`riskEvaluation.${key}`]: args[key] }) )
                    .reduce((prev, cur) => ({ ...prev, ...cur }));

    this.parent().update(_args, cb);
  }
});
