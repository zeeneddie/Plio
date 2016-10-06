import { Template } from 'meteor/templating';


Template.RCA_Cause_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  index: '',
  text: '',
  isNew: true,
  label() {
    return `Cause ${this.index()}`;
  },
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { index, text } = this.getData();
      if ((text === this.templateInstance.data.text) || !index) {
        return;
      }

      let args;
      if (this.isNew()) {
        args = {
          options: { $addToSet: { 'rootCauseAnalysis.causes': { index, text } } }
        };
      } else {
        if (text) {
          args = {
            query: { 'rootCauseAnalysis.causes': { $elemMatch: { index } } },
            options: { $set: { 'rootCauseAnalysis.causes.$.text': text } }
          };
        } else {
          args = {
            options: { $pull: { 'rootCauseAnalysis.causes': { index } } }
          };
        }
      }

      args && this.parent().update(args);
    });
  },
  getData() {
    return {
      index: this.index(),
      text: this.text()
    };
  }
})
