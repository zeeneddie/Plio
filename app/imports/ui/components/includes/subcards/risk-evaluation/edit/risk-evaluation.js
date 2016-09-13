import { Template } from 'meteor/templating';

import { chain } from '/imports/api/helpers.js';

Template.Subcards_RiskEvaluation_Edit.viewmodel({
  mixin: 'utils',
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
    const loadArgs = (err) => {
      // In case the error was thrown we backup stored data
      if (err) this.load({ ...data });
    };
    const callback = chain(loadArgs, cb);

    const _args = _.keys(args)
                    .map(key => ({ [`riskEvaluation.${key}`]: args[key] }) )
                    .reduce((prev, cur) => ({ ...prev, ...cur }));

    this.load({ ...args });

    this.parent().update(_args, callback);
  }
});
