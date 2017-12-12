import { Template } from 'meteor/templating';
import get from 'lodash.get';
import curry from 'lodash.curry';
import moment from 'moment-timezone';

import { AnalysisStatuses } from '/imports/share/constants.js';
import { AnalysisTitles } from '/imports/api/constants.js';
import { getTzTargetDate } from '/imports/share/helpers';
import { P_IsAnalysisOwner } from '/imports/api/checkers';

Template.Subcards_AnalysisWrapper_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'date', 'modal', 'utils'],
  defaultTargetDate() {
    const workflowDefaults = this.organization().workflowDefaults;
    const found = _.keys(workflowDefaults)
      .find(key => this.magnitude() === key.replace('Nc', ''));
    const workflowDefault = workflowDefaults[found];
    if (workflowDefault) {
      const { timeUnit, timeValue } = workflowDefault;
      const date = moment(new Date());
      date[timeUnit](date[timeUnit]() + timeValue);
      return date.toDate();
    }
  },
  RCALabel: AnalysisTitles.rootCauseAnalysis,
  UOSLabel: AnalysisTitles.updateOfStandards,
  magnitude: '',
  analysis: '',
  updateOfStandards: '',
  isCompleted({ status } = {}) {
    const completed = parseInt(get(_.invert(AnalysisStatuses), 'Completed'), 10);
    return Object.is(status, completed);
  },
  isCurrentOwner(doc) {
    return P_IsAnalysisOwner(Meteor.userId(), this.organizationId(), doc);
  },
  methods() {
    const _id = this._id();
    const { timezone } = this.organization();

    const setKey = curry((key, method) => ({ ...args }, cb) =>
      this.modal().callMethod(method, { _id, [key]: args[key] }, cb));
    const setAssignee = curry((key, method) => ({ executor }, cb) =>
      this.modal().callMethod(method, { _id, [key]: executor }, cb));
    const setDate = curry((key, method) => ({ date }, cb) =>
      this.modal().callMethod(method, { _id, [key]: getTzTargetDate(date, timezone) }, cb));
    const undo = method => (args, cb) =>
      this.modal().callMethod(method, { _id }, cb);

    const {
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
      setStandardsUpdateComments,
    } = this.methodRefs();

    const half = {
      setExecutor: setAssignee('executor'),
      setDate: setDate('targetDate'),
      setCompletedBy: setAssignee('completedBy'),
      setCompletedDate: setDate('completedAt'),
      setComments: setKey('completionComments'),
      complete: setKey('completionComments'),
      undo,
    };

    const makeMethods = (methods, from) => methods.map((ref, i) => {
      const key = Object.keys(from)[i];

      if (this.callMethod) {
        /**
         * because we need to handle this methods differently in subcard, for example
         * @param {function} method caller
         * @param {object} method arguments
         * @param {function} optional callback
         */
        return {
          [key]: () => (...args) =>
            this.callMethod(from[key](ref), ...args),
        };
      }

      return { [key]: () => from[key](ref) };
    }).reduce((prev, cur) => ({ ...prev, ...cur }), {});

    return {
      Analysis: () => makeMethods([
        setAnalysisExecutor,
        setAnalysisDate,
        setAnalysisCompletedBy,
        setAnalysisCompletedDate,
        setAnalysisComments,
        completeAnalysis,
        undoAnalysis,
      ], half),
      UpdateOfStandards: () => makeMethods([
        setStandardsUpdateExecutor,
        setStandardsUpdateDate,
        setStandardsUpdateCompletedBy,
        setStandardsUpdateCompletedDate,
        setStandardsUpdateComments,
        updateStandards,
        undoStandardsUpdate,
      ], half),
    };
  },
});
