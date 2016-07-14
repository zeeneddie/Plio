import { Template } from 'meteor/templating';

import { TreatmentPlanPriorities } from '/imports/api/constants.js';

Template.TreatmentPlan_Priority_Edit.viewmodel({
  priority: '',
  priorityList() {
    return _.keys(TreatmentPlanPriorities).map(key => ({ value: key, text: TreatmentPlanPriorities[key] }) );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value:priority } = viewmodel.getData();

    if (this.templateInstance.data.priority === priority) return;

    this.priority(priority);

    this.parent().update({ priority });
  },
  getData() {
    const { priority } = this.getData();
    return { priority };
  }
});
