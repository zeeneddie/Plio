import { Template } from 'meteor/templating';

import { TreatmentPlanDecisions } from '/imports/api/constants.js';

Template.TreatmentPlan_Decision_Edit.viewmodel({
  decision: '',
  decisionList() {
    return _.keys(TreatmentPlanDecisions).map(key => ({ value: key, text: TreatmentPlanDecisions[key] }) );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value:decision } = viewmodel.getData();

    if (this.templateInstance.data.decision === decision) return;

    this.decision(decision);

    this.parent().update({ decision });
  },
  getData() {
    const { decision } = this.data();
    return { decision };
  }
});
