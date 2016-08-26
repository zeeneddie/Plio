import {
  ProblemMagnitudes, ProblemsStatuses,
  AnalysisStatuses, CollectionNames
} from '/imports/api/constants.js';
import { Standards } from '/imports/api/standards/standards.js';
import Utils from '../../utils.js';

import DocumentUpdateAudit from './DocumentUpdateAudit.js';
import DepartmentUpdateAudit from './mixins/DepartmentUpdateAudit.js';
import DescriptionUpdateAudit from './mixins/DescriptionUpdateAudit.js';
import FileUpdateAudit from './mixins/FileUpdateAudit.js';
import ImprovementPlanUpdateAudit from './mixins/ImprovementPlanUpdateAudit.js';


const base = Utils.inherit(DocumentUpdateAudit, [
  DepartmentUpdateAudit, DescriptionUpdateAudit,
  FileUpdateAudit, ImprovementPlanUpdateAudit
]);

export default class ProblemUpdateAudit extends base {

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
    this._problemActionChanged(diff, 'Root cause analysis');
  }

  _analysisStatusChanged(diff) {
    this._problemActionStatusChanged(diff, 'Root cause analysis', 'analysis');
  }

  _magnitudeChanged(diff) {
    this._prettifyValues(diff, val => ProblemMagnitudes[val]);
  }

  _standardsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const docName = `${sequentialId} "${title}"`;

    const { field, kind, item:standardId } = diff;
    let message, standardMessage;

    if (kind === ITEM_ADDED) {
      message = 'Document was linked to "[standardName]" standard';
      standardMessage = `${docName} was linked to this document`;
    } else if (kind === ITEM_REMOVED) {
      message = 'Document was unlinked from "[standardName]" standard';
      standardMessage = `${docName} was unlinked to from document`;
    }

    if (!(standardId && message && standardMessage)) {
      return;
    }

    const standard = Standards.findOne({ _id: standardId });
    const standardName = (standard && standard.title) || standardId;
    message = message.replace('[standardName]', standardName);

    this._createLog({ message, field });

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
    this._problemActionChanged(diff, 'Update of standards');
  }

  _updateOfStandardsStatusChanged(diff) {
    this._problemActionStatusChanged(diff, 'Update of standards', 'updateOfStandards');
  }

  _problemActionChanged(diff, title) {
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

  _problemActionStatusChanged(diff, title, docField) {
    const completedAtDiff = _(this._diff).find(
      ({ field }) => field === `${docField}.completedAt`
    );
    const completedByDiff = _(this._diff).find(
      ({ field }) => field === `${docField}.completedBy`
    );

    if (!(completedAtDiff && completedByDiff)) {
      return;
    }

    const commentsDiff = _(this._diff).find(
      ({ field }) => field === `${docField}.completionComments`
    );

    const { newValue } = diff;
    let message;
    if (newValue === 1 /* Completed */) {
      const { newValue:comments } = commentsDiff || {};
      message = `${title} completed`;
      message = comments ? `${message}: ${comments}` : message;
    } else if (newValue === 0 /* Not completed */) {
      message = `${title} cancelled`;
    }

    if (!message) {
      return;
    }

    const logData = { message };
    if (newValue === 1) {
      const { newValue:executor } = completedByDiff;
      const { newValue:date } = completedAtDiff;
      _(logData).extend({ date, executor });
    }

    this._createLog(logData);

    diff.isProcessed = true;
    completedAtDiff.isProcessed = true;
    completedByDiff.isProcessed = true;
    commentsDiff && (commentsDiff.isProcessed = true);
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
      identifiedAt: 'Identified date',
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

}
