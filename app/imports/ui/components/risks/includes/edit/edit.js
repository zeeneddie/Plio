import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import {
  update,
  remove,
  updateViewedBy,
  insertScore,
  removeScore,
  completeAnalysis,
  undoAnalysis,
  setAnalysisDate,
  updateStandards,
  undoStandardsUpdate,
  setStandardsUpdateDate,
  setAnalysisExecutor,
  setStandardsUpdateExecutor,
  setAnalysisCompletedBy,
  setAnalysisCompletedDate,
  setAnalysisComments,
  setStandardsUpdateCompletedBy,
  setStandardsUpdateCompletedDate,
  setStandardsUpdateComments
} from '/imports/api/risks/methods.js';
import { WorkflowTypes } from '/imports/share/constants.js';
import { AnalysisTitles } from '/imports/api/constants.js';
import { isViewed } from '/imports/api/checkers.js';
import { getTzTargetDate } from '/imports/share/helpers.js';


Template.Risks_Card_Edit.viewmodel({
  mixin: ['risk', 'organization', 'callWithFocusCheck', 'modal', 'utils', 'router', 'collapsing'],
  RiskRCALabel: AnalysisTitles.riskAnalysis,

  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  slingshotDirective: 'riskFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      riskId: this._id()
    };
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
      undoStandardsUpdate,
      setAnalysisCompletedBy,
      setAnalysisCompletedDate,
      setAnalysisComments,
      setStandardsUpdateCompletedBy,
      setStandardsUpdateCompletedDate,
      setStandardsUpdateComments
    });
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
          if (err) {
            swal.close();
            return;
          };
          swal('Removed!', `The risk "${title}" was removed successfully.`, 'success');

          this.modal().close();

          this.redirect();
        });
      }
    );
  },
  redirect() {
    const list = Object.assign({}, ViewModel.findOne('Risks_List'));

    if (list) {
      const { first } = Object.assign({}, invoke(list, '_findRiskForFilter'));

      if (first) {
        const { _id } = first;

        Meteor.setTimeout(() => {
          this.goToRisk(_id);
          this.expandCollapsed(_id);
        });
      }
    }
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
