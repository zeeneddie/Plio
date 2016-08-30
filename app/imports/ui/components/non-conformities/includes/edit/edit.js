import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import {
  update, remove, completeAnalysis, undoAnalysis,
  setAnalysisDate, updateStandards, undoStandardsUpdate,
  setStandardsUpdateDate, setAnalysisExecutor, setStandardsUpdateExecutor
} from '/imports/api/non-conformities/methods.js';
import { getTzTargetDate } from '/imports/api/helpers.js';


Template.NC_Card_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'modal', 'callWithFocusCheck'],
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  slingshotDirective: 'nonConformityFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      nonConformityId: this._id()
    };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
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
  getMethodRefs() {
    return () => ({
      setAnalysisExecutor,
      setAnalysisDate,
      completeAnalysis,
      undoAnalysis,
      setStandardsUpdateExecutor,
      setStandardsUpdateDate,
      updateStandards,
      undoStandardsUpdate
    });
  },
  // getUpdateAnalysisExecutorFn() {
  //   return this.updateAnalysisExecutor.bind(this);
  // },
  // updateAnalysisExecutor({ executor }, cb) {
  //   const _id = this._id();
  //
  //   this.modal().callMethod(setAnalysisExecutor, { _id, executor }, cb)
  // },
  // getUpdateAnalysisDateFn() {
  //   return this.updateAnalysisDate.bind(this);
  // },
  // updateAnalysisDate({ date }, cb) {
  //   const _id = this._id();
  //
  //   const { timezone } = this.organization();
  //   const tzDate = getTzTargetDate(date, timezone);
  //
  //   this.modal().callMethod(setAnalysisDate, { _id, targetDate: tzDate }, cb);
  // },
  // getCompleteAnalysisFn() {
  //   return this.completeAnalysis.bind(this);
  // },
  // completeAnalysis({ completionComments }, cb) {
  //   const _id = this._id();
  //   this.modal().callMethod(completeAnalysis, { _id, completionComments }, cb);
  // },
  // getUndoAnalysisFn() {
  //   return this.undoAnalysis.bind(this);
  // },
  // undoAnalysis(cb) {
  //   const _id = this._id();
  //   this.modal().callMethod(undoAnalysis, { _id }, cb);
  // },
  // getUpdateStandardsExecutorFn() {
  //   return this.updateStandardsExecutor.bind(this);
  // },
  // updateStandardsExecutor({ executor }, cb) {
  //   const _id = this._id();
  //
  //   this.modal().callMethod(setStandardsUpdateExecutor, { _id, executor }, cb);
  // },
  // getUpdateStandardsDateFn() {
  //   return this.updateStandardsDate.bind(this);
  // },
  // updateStandardsDate({ date }, cb) {
  //   const _id = this._id();
  //
  //   const { timezone } = this.organization();
  //   const tzDate = getTzTargetDate(date, timezone);
  //
  //   this.modal().callMethod(setStandardsUpdateDate, { _id, targetDate: tzDate }, cb);
  // },
  // getUpdateStandardsFn() {
  //   return this.updateStandards.bind(this);
  // },
  // updateStandards({ completionComments }, cb) {
  //   const _id = this._id();
  //   this.modal().callMethod(updateStandards, { _id, completionComments }, cb);
  // },
  // getUndoStandardsUpdateFn() {
  //   return this.undoStandardsUpdate.bind(this);
  // },
  // undoStandardsUpdate(cb) {
  //   const _id = this._id();
  //   this.modal().callMethod(undoStandardsUpdate, { _id }, cb);
  // },
  remove() {
    const { title } = this.NC();
    const _id = this._id();

    swal(
      {
        title: 'Are you sure?',
        text: `The non-conformity "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) {
            swal.close();
            return;
          };

          swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');

          this.modal().close();
        });
      }
    );
  },
});
