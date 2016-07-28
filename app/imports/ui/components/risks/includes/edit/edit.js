import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import {
  update, remove, updateViewedBy,
  insertScore, removeScore,
  completeAnalysis, undoAnalysis, setAnalysisDate,
  updateStandards, undoStandardsUpdate, setStandardsUpdateDate,
  setAnalysisExecutor, setStandardsUpdateExecutor
} from '/imports/api/risks/methods.js';
import { WorkflowTypes } from '/imports/api/constants.js';
import { isViewed } from '/imports/api/checkers.js';
import { getTzTargetDate } from '/imports/api/helpers.js';


Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization', 'callWithFocusCheck', 'modal', 'utils'],
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
  getUpdateAnalysisExecutorFn() {
    return this.updateAnalysisExecutor.bind(this);
  },
  updateAnalysisExecutor({ executor }, cb) {
    const _id = this._id();

    this.modal().callMethod(setAnalysisExecutor, { _id, executor }, cb)
  },
  getUpdateAnalysisDateFn() {
    return this.updateAnalysisDate.bind(this);
  },
  updateAnalysisDate({ date }, cb) {
    const _id = this._id();

    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(setAnalysisDate, { _id, targetDate: tzDate }, cb);
  },
  getCompleteAnalysisFn() {
    return this.completeAnalysis.bind(this);
  },
  completeAnalysis(cb) {
    const _id = this._id();
    this.modal().callMethod(completeAnalysis, { _id }, cb);
  },
  getUndoAnalysisFn() {
    return this.undoAnalysis.bind(this);
  },
  undoAnalysis(cb) {
    const _id = this._id();
    this.modal().callMethod(undoAnalysis, { _id }, cb);
  },
  getUpdateStandardsExecutorFn() {
    return this.updateStandardsExecutor.bind(this);
  },
  updateStandardsExecutor({ executor }, cb) {
    const _id = this._id();

    this.modal().callMethod(setStandardsUpdateExecutor, { _id, executor }, cb);
  },
  getUpdateStandardsDateFn() {
    return this.updateStandardsDate.bind(this);
  },
  updateStandardsDate({ date }, cb) {
    const _id = this._id();

    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(setStandardsUpdateDate, { _id, targetDate: tzDate }, cb);
  },
  getUpdateStandardsFn() {
    return this.updateStandards.bind(this);
  },
  updateStandards(cb) {
    const _id = this._id();
    this.modal().callMethod(updateStandards, { _id }, cb);
  },
  getUndoStandardsUpdateFn() {
    return this.undoStandardsUpdate.bind(this);
  },
  undoStandardsUpdate(cb) {
    const _id = this._id();
    this.modal().callMethod(undoStandardsUpdate, { _id }, cb);
  },
  showRootCauseAnalysis() {
    return this.risk() && (this.risk().workflowType === WorkflowTypes.SIX_STEP);
  },
  onInsertScoreCb() {
    return this.insertScore.bind(this);
  },
  insertScore({ ...args }, cb) {
    const _id = this._id();

    this.modal().callMethod(insertScore, { _id, ...args }, cb);
  },
  onRemoveScoreCb() {
    return this.removeScore.bind(this);
  },
  removeScore({ ...args }, cb) {
    const _id = this._id();

    this.modal().callMethod(removeScore, { _id, ...args }, cb);
  }
});
