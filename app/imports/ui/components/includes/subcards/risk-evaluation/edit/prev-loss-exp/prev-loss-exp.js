import { Template } from 'meteor/templating';

Template.RiskEvaluation_PrevLossExp_Edit.viewmodel({
  prevLossExp: '',
  update() {
    const { prevLossExp } = this.getData();

    if (this.templateInstance.data.prevLossExp === prevLossExp) return;

    this.parent().update({ prevLossExp });
  },
  getData() {
    const { prevLossExp } = this.data();
    return { prevLossExp };
  },
});
