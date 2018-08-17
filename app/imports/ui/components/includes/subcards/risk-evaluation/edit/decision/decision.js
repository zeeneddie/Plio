import { Template } from 'meteor/templating';

import { RiskEvaluationDecisions } from '/imports/share/constants.js';

Template.RiskEvaluation_Decision_Edit.viewmodel({
  decision: '',
  decisionList() {
    return _.keys(RiskEvaluationDecisions).map(key => ({ value: key, text: RiskEvaluationDecisions[key] }));
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value: decision } = viewmodel.getData();

    if (this.templateInstance.data.decision === decision) return;

    this.decision(decision);

    this.parent().update({ decision });
  },
  getData() {
    const { decision } = this.data();
    return { decision };
  },
});
