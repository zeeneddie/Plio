import { Template } from 'meteor/templating';

import {
  update, remove,
  completeAnalysis, undoAnalysis,
  setAnalysisTargetDate,
  updateStandards, undoStandardsUpdate
} from '/imports/api/risks/methods.js';
import { WorkflowTypes } from '/imports/api/constants.js';


Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization', 'callWithFocusCheck', 'modal'],
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  slingshotDirective: 'risksFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      riskId: this._id()
    };
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const _id = this._id();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  remove() {
    const { title } = this.risk();
    const _id = this._id();

    swal(
      {
        title: 'Are you sure?',
        text: `The risk "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) return;
          swal('Removed!', `The risk "${title}" was removed successfully.`, 'success');

          this.modal().close();
        });
      }
    );
  },
  updateAnalysisTargetDate({ date }) {
    const _id = this._id();
    this.modal().callMethod(setAnalysisTargetDate, { _id, targetDate: date });
  },
  completeAnalysis() {
    const _id = this._id();
    this.modal().callMethod(completeAnalysis, { _id });
  },
  undoAnalysis() {
    const _id = this._id();
    this.modal().callMethod(undoAnalysis, { _id });
  },
  updateStandards() {
    const _id = this._id();
    this.modal().callMethod(updateStandards, { _id });
  },
  undoStandardsUpdate() {
    const _id = this._id();
    this.modal().callMethod(undoStandardsUpdate, { _id });
  },
  showRootCauseAnalysis() {
    return this.risk() && (this.risk().workflowType === WorkflowTypes.SIX_STEP);
  }
});
