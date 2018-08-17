import { Template } from 'meteor/templating';

import { RiskEvaluationPriorities } from '/imports/share/constants.js';

Template.RiskEvaluation_Priority_Edit.viewmodel({
  priority: '',
  priorityList() {
    return _.keys(RiskEvaluationPriorities).map(key => ({ value: key, text: RiskEvaluationPriorities[key] }));
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value: priority } = viewmodel.getData();

    if (this.templateInstance.data.priority === priority) return;

    this.priority(priority);

    this.parent().update({ priority });
  },
  getData() {
    const { priority } = this.getData();
    return { priority };
  },
});
