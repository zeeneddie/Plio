import { Template } from 'meteor/templating';

import { WorkflowTypes } from '/imports/api/constants.js';


Template.NC_Card_Edit_Main.viewmodel({
  isStandardsEditable: true,
  update(...args) {
    this.parent().update(...args);
  },
  updateAnalysisTargetDate(...args) {
    this.parent().updateAnalysisTargetDate(...args);
  },
  completeAnalysis() {
    this.parent().completeAnalysis();
  },
  showRootCauseAnalysis() {
    const NC = this.NC && this.NC();
    return NC && (NC.workflowType === WorkflowTypes.SIX_STEP);
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
