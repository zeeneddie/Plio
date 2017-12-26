import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { AnalysisFieldPrefixes } from '../../../../../../../api/constants';

Template.RCA_Cause_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  onCreated() {
    this._originalData = this.templateInstance.data;
    this.loadData(this.cause());
  },
  autorun() {
    const cause = this.cause();
    if (!_.isEqual(this.templateInstance.data, this._originalData)) {
      this.loadData(cause);
      this._originalData = this.templateInstance.data;
    }
  },
  cause: '',
  index: '',
  text: '',
  isNew: true,
  prefix: AnalysisFieldPrefixes.CAUSE,
  loadData(cause) {
    this.load({
      index: cause.index,
      text: cause.text,
      isNew: cause.isNew,
    });
  },
  label() {
    return `${this.prefix()} ${this.index()}`;
  },
  update(e) {
    const { index, text } = this.getData();
    if ((text === this.templateInstance.data.text) || !index) {
      return;
    }

    let args;
    if (this.isNew()) {
      if (text) {
        args = {
          options: { $addToSet: { 'rootCauseAnalysis.causes': { index, text } } },
        };
      }
    } else if (text) {
      args = {
        query: { 'rootCauseAnalysis.causes': { $elemMatch: { index } } },
        options: { $set: { 'rootCauseAnalysis.causes.$.text': text } },
      };
    } else {
      args = {
        options: { $pull: { 'rootCauseAnalysis.causes': { index } } },
      };
    }

    if (args) {
      this.callWithFocusCheck(e, () => {
        this.parent().update(args);
      });
    }
  },
  getData() {
    return {
      index: this.index(),
      text: this.text(),
    };
  },
});
