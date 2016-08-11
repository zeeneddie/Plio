import {
  ProblemMagnitudes, ProblemsStatuses,
  AnalysisStatuses, CollectionNames
} from '../constants.js';
import { Departments } from '../departments/departments.js';
import { Standards } from '../standards/standards.js';
import DocumentUpdateAudit from '../audit-base/DocumentUpdateAudit.js';


export default class ProblemUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'magnitude':
          this._magnitudeChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
        case 'standardsIds':
          this._standardsChanged(diff);
          break;
        case 'departmentsIds':
          this._departmentsChanged(diff);
          break;
        case 'identifiedBy':
        case 'analysis.executor':
        case 'updateOfStandards.executor':
          this._userChanged(diff);
          break;
        case 'analysis.status':
          this._analysisStatusChanged(diff);
          break;
        case 'updateOfStandards.status':
          this._updateOfStandardsStatusChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _magnitudeChanged(diff) {
    this._prettifyValues(diff, val => ProblemMagnitudes[val]);
  }

  _statusChanged(diff) {
    this._prettifyValues(diff, val => ProblemsStatuses[val]);
  }

  _standardsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const docName = `${sequentialId} "${title}"`;

    const { kind, addedItem, removedItem } = diff;
    let standardId, message, standardMessage;
    if (kind === ITEM_ADDED) {
      standardId = addedItem;
      message = 'Linked to "[standardName]"';
      standardMessage = `${docName} linked`;
    } else if (kind === ITEM_REMOVED) {
      standardId = removedItem;
      message = 'Unlinked from "[standardName]"';
      standardMessage = `${docName} unlinked`;
    }

    if (!(standardId && message && standardMessage)) {
      return;
    }

    const standard = Standards.findOne({ _id: standardId });
    const standardName = (standard && standard.title) || standardId;
    message = message.replace('[standardName]', standardName);

    this._createLog({
      message,
      field: 'standardsIds'
    });

    this._createLog({
      collection: CollectionNames.STANDARDS,
      message: standardMessage,
      documentId: standardId
    });

    diff.isProcessed = true;
  }

  _departmentsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, addedItem, removedItem } = diff;
    let departmentId, message;
    if (kind === ITEM_ADDED) {
      departmentId = addedItem;
      message = 'Linked to [departmentName] department';
    } else if (kind === ITEM_REMOVED) {
      departmentId = removedItem;
      message = 'Unlinked from [departmentName] department';
    }

    if (!(departmentId && message)) {
      return;
    }

    const department = Departments.findOne({ _id: departmentId });
    const departmentName = (department && department.name) || departmentId;
    message = message.replace('[departmentName]', departmentName);

    this._createLog({
      message,
      field: 'departmentsIds'
    });

    diff.isProcessed = true;
  }

  _analysisStatusChanged(diff) {
    const completedAtDiff = _(this._diff).find(
      ({ field }) => field === 'analysis.completedAt'
    );
    const completedByDiff = _(this._diff).find(
      ({ field }) => field === 'analysis.completedBy'
    );

    if (!(completedAtDiff && completedByDiff)) {
      return;
    }

    const { newValue } = diff;
    let message;
    if (newValue === 1 /* Completed */) {
      message = 'Root cause analysis completed';
    } else if (newValue === 0 /* Not completed */) {
      message = 'Completion of root cause analysis cancelled';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    completedAtDiff.isProcessed = true;
    completedByDiff.isProcessed = true;
  }

  _updateOfStandardsStatusChanged(diff) {
    const completedAtDiff = _(this._diff).find(
      ({ field }) => field === 'updateOfStandards.completedAt'
    );
    const completedByDiff = _(this._diff).find(
      ({ field }) => field === 'updateOfStandards.completedBy'
    );

    if (!(completedAtDiff && completedByDiff)) {
      return;
    }

    const { newValue } = diff;
    let message;
    if (newValue === 1 /* Completed */) {
      message = 'Update of standards completed';
    } else if (newValue === 0 /* Not completed */) {
      message = 'Update of standards cancelled';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    completedAtDiff.isProcessed = true;
    completedByDiff.isProcessed = true;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      serialNumber: 'Serial number',
      sequentialId: 'Sequential ID',
      status: 'Status',
      workflowType: 'Workflow type',
      title: 'Title',
      identifiedBy: 'Identified by',
      identifiedAt: 'Identified at',
      magnitude: 'Magnitude',
      standardsIds: 'Standards',
      description: 'Description',
      departmentsIds: 'Departments',
      'analysis.targetDate': 'Root cause analysis target date',
      'analysis.executor': 'Root cause analysis executor',
      'analysis.status': 'Root cause analysis status',
      'analysis.completedAt': 'Root cause analysis completion date',
      'analysis.completedBy': 'Root cause analysis completion executor',
      'analysis.completionComments': 'Root cause analysis completion comments',
      'updateOfStandards.targetDate': 'Target date for update of standards',
      'updateOfStandards.executor': 'Executor of update of standards',
      'updateOfStandards.status': 'Status of update of standards',
      'updateOfStandards.completedAt': 'Update of standards completion date',
      'updateOfStandards.completedBy': 'Update of standards completion executor',
      'updateOfStandards.completionComments': 'Update of standards completion comments'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
      description: {
        [FIELD_ADDED]: 'Description set',
        [FIELD_CHANGED]: 'Description changed',
        [FIELD_REMOVED]: 'Description removed',
      }
    };

    return _(messages).extend(super._messages);
  }

}
