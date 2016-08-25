import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { AnalysisStatuses } from '/imports/api/constants.js';
import { getTzTargetDate } from '/imports/api/helpers.js';

Template.Subcards_RCA_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'date', 'modal'],
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
  RCALabel: 'Root cause analysis',
  UOSLabel: 'Update of standard(s)',
  magnitude: '',
  analysis: '',
  updateOfStandards: '',
  isAnalysisCompleted() {
    const status = get(this.analysis(), 'status');
    const completed = parseInt(get(_.invert(AnalysisStatuses), 'Completed'), 10);
    return Object.is(status, completed);
  },
  methods() {
    const _id = this._id();
    const { timezone } = this.organization();

    const setExecutor = method => ({ executor }, cb) =>
      this.modal().callMethod(method, { _id, executor }, cb);
    const setTargetDate = method => ({ date }, cb) =>
      this.modal().callMethod(method, { _id, targetDate: getTzTargetDate(date, timezone) }, cb);
    const complete = method => ({ completionComments }, cb) =>
      this.modal().callMethod(method, { _id, completionComments }, cb);
    const undo = method => cb =>
      this.modal().callMethod(method, { _id }, cb);

    const {
      setAnalysisExecutor,
      setAnalysisDate,
      completeAnalysis,
      undoAnalysis,
      setStandardsUpdateExecutor,
      setStandardsUpdateDate,
      updateStandards,
      undoStandardsUpdate
    } = this.methodRefs();

    return {
      Analysis: () => ({
        setExecutor: () => setExecutor(setAnalysisExecutor),
        setDate: () => setTargetDate(setAnalysisDate),
        complete: () => complete(completeAnalysis),
        undo: () => undo(undoAnalysis)
      }),
      UpdateOfStandards: () => ({
        setExecutor: () => setExecutor(setStandardsUpdateExecutor),
        setDate: () => setTargetDate(setStandardsUpdateDate),
        complete: () => complete(updateStandards),
        undo: () => undo(undoStandardsUpdate)
      })
    };
  },
  update({ query = {}, options = {}, ...args }, cb) {
    const allArgs = { ...args, options, query };

    this.parent().update(allArgs, cb);
  }
});
