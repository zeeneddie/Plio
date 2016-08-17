import {
  ProblemMagnitudes, ProblemsStatuses,
  AnalysisStatuses, CollectionNames
} from '../constants.js';
import { Departments } from '../departments/departments.js';
import { Standards } from '../standards/standards.js';
import DocumentUpdateAudit from '/imports/core/audit/DocumentUpdateAudit.js';


export default class ProblemUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'analysis':
          this._analysisChanged(diff);
          break;
        case 'analysis.executor':
        case 'identifiedBy':
        case 'updateOfStandards.executor':
          this._userChanged(diff);
          break;
        case 'analysis.status':
          this._analysisStatusChanged(diff);
          break;
        case 'departmentsIds':
          this._departmentsChanged(diff);
          break;
        case 'files':
          this._filesChanged(diff);
        case 'files.$.url':
          this._fileUrlChanged(diff);
        case 'magnitude':
          this._magnitudeChanged(diff);
          break;
        case 'standardsIds':
          this._standardsChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
        case 'updateOfStandards':
          this._updateOfStandardsChanged(diff);
          break;
        case 'updateOfStandards.status':
          this._updateOfStandardsStatusChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _analysisChanged(diff) {
    this._workflowActionChanged(diff, 'Root cause analysis');
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

  _magnitudeChanged(diff) {
    this._prettifyValues(diff, val => ProblemMagnitudes[val]);
  }

  _standardsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const docName = `${sequentialId} "${title}"`;

    const { kind, item:standardId } = diff;
    let message, standardMessage;

    if (kind === ITEM_ADDED) {
      message = 'Linked to "[standardName]"';
      standardMessage = `${docName} linked`;
    } else if (kind === ITEM_REMOVED) {
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

  _statusChanged(diff) {
    this._prettifyValues(diff, val => ProblemsStatuses[val]);
  }

  _updateOfStandardsChanged(diff) {
    this._workflowActionChanged(diff, 'Update of standards');
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

  _workflowActionChanged(diff, title) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, newValue, oldValue } = diff;
    let item, message;

    if (kind === FIELD_ADDED) {
      item = newValue;
      message = `${title} added: [desc]`;
    } else if (kind === FIELD_REMOVED) {
      item = oldValue;
      message = `${title} removed: [desc]`;
    }

    if (!(message && _(item).isObject())) {
      return;
    }

    const { completedAt, completedBy, executor, status, targetDate } = item;
    const desc = [];

    if (executor !== undefined) {
      const user = Meteor.users.findOne({ _id: executor });
      const userName = (user && user.fullNameOrEmail()) || executor;
      desc.push(`executor - ${userName}`);
    }

    if (targetDate !== undefined) {
      const date = moment(targetDate).tz('UTC').toString();
      desc.push(`target date - ${date}`);
    }

    if (status !== undefined) {
      desc.push(`status - ${AnalysisStatuses[status]}`);
    }

    if (completedBy !== undefined) {
      const user = Meteor.users.findOne({ _id: completedBy });
      const userName = (user && user.fullNameOrEmail()) || executor;
      desc.push(`completed by ${userName}`);
    }

    if (completedAt !== undefined) {
      const date = moment(completedAt).tz('UTC').toString();
      desc.push(`completed on ${date}`);
    }

    if (desc.length) {
      message = message.replace('[desc]', desc.join(', '));
    } else {
      message = new RegExp(`^(${title} (?:added|removed))`).exec(message)[1];
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      analysis: 'Root cause analysis',
      'analysis.completedAt': 'Root cause analysis completion date',
      'analysis.completedBy': 'Root cause analysis completion executor',
      'analysis.completionComments': 'Root cause analysis completion comments',
      'analysis.executor': 'Root cause analysis executor',
      'analysis.status': 'Root cause analysis status',
      'analysis.targetDate': 'Root cause analysis target date',
      departmentsIds: 'Departments',
      description: 'Description',
      files: 'Files',
      'files.$.extension': 'File extension',
      'files.$.name': 'File name',
      'files.$.url': 'File url',
      identifiedAt: 'Identified at',
      identifiedBy: 'Identified by',
      magnitude: 'Magnitude',
      sequentialId: 'Sequential ID',
      serialNumber: 'Serial number',
      standardsIds: 'Standards',
      status: 'Status',
      title: 'Title',
      updateOfStandards: 'Update of standards',
      'updateOfStandards.completedAt': 'Update of standards completion date',
      'updateOfStandards.completedBy': 'Update of standards completion executor',
      'updateOfStandards.completionComments': 'Update of standards completion comments',
      'updateOfStandards.executor': 'Executor of update of standards',
      'updateOfStandards.status': 'Status of update of standards',
      'updateOfStandards.targetDate': 'Target date for update of standards',
      workflowType: 'Workflow type'
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
