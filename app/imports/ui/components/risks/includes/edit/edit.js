import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import {
  update, remove, updateViewedBy,
  insertScore, removeScore,
  completeAnalysis, undoAnalysis,
  setAnalysisDate,
  updateStandards, undoStandardsUpdate
} from '/imports/api/risks/methods.js';
import { WorkflowTypes } from '/imports/api/constants.js';
import { isViewed } from '/imports/api/checkers.js';
import { getTzTargetDate } from '/imports/api/helpers.js';


Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization', 'callWithFocusCheck', 'modal', 'utils'],
  autorun() {
    const doc = this.risk();
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
  },
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
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
  updateAnalysisDate({ date }) {
    const _id = this._id();

    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(setAnalysisDate, { _id, targetDate: tzDate });
  },
  completeAnalysis() {
    const _id = this._id();
    this.modal().callMethod(completeAnalysis, { _id });
  },
  undoAnalysis() {
    const _id = this._id();
    this.modal().callMethod(undoAnalysis, { _id });
  },
  updateStandardsDate({ date, ...args }) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(update, {
      _id: this._id(),
      'updateOfStandards.targetDate': tzDate,
      ...args
    });
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
