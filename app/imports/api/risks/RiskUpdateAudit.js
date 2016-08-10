import moment from 'moment-timezone';

import {
  CollectionNames,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions
} from '../constants.js';
import { RiskTypes } from '../risk-types/risk-types.js';
import ProblemUpdateAudit from '../problems/ProblemUpdateAudit.js';


export default class RiskUpdateAudit extends ProblemUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'typeId':
          this._typeChanged(diff);
          break;
        case 'scores':
          this._scoringChanged(diff);
        case 'riskEvaluation.priority':
          this._riskEvaluationPriorityChanged(diff);
          break;
        case 'riskEvaluation.decision':
          this._riskEvaluationDecisionChanged(diff);
          break;
        case 'review.reviewedBy':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _typeChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const riskType = RiskTypes.findOne({ _id: val });
      return riskType && riskType.title;
    });
  }

  _scoringChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, addedItem, removedItem } = diff;
    let score, message;
    if (kind === ITEM_ADDED) {
      score = addedItem;
      message = 'Added risk scrore: [scoreDesc]';
    } else if (kind === ITEM_REMOVED) {
      score = removedItem;
      message = 'Removed risk score: [scoreDesc]';
    }

    if (!(score && message)) {
      return;
    }

    const { value, scoredAt, scoredBy } = score;
    const executor = Meteor.users.findOne({ _id: scoredBy });
    const executorName = (executor && executor.fullNameOrEmail()) || scoredBy;
    const scoreDate = moment(scoredAt).tz('UTC').toString();
    const scoreDesc = `value="${value}", scored by ${executorName}, scored at ${scoreDate}`;

    message = message.replace('[scoreDesc]', scoreDesc);

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _riskEvaluationPriorityChanged(diff) {
    this._prettifyValues(diff, val => RiskEvaluationPriorities[val]);
  }

  _riskEvaluationDecisionChanged(diff) {
    this._prettifyValues(diff, val => RiskEvaluationDecisions[val]);
  }

  static get _collection() {
    return CollectionNames.RISKS;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      typeId: 'Risk type',
      scores: 'Risk scoring',
      riskEvaluation: 'Risk evaluation',
      review: 'Review',
      'scores.$.value': 'Risk score value',
      'scores.$.rowId': 'Risk score row ID',
      'scores.$.scoredBy': 'Risk score executor',
      'scores.$.scoredAt': 'Risk score date',
      'riskEvaluation.comments': 'Risk evaluation comments',
      'riskEvaluation.prevLossExp': 'Risk evaluation previous loss experience',
      'riskEvaluation.priority': 'Risk evaluation treatment decision',
      'riskEvaluation.decision': 'Risk evaluation treatment priority',
      'review.status': 'Review status',
      'review.reviewedAt': 'Review date',
      'review.reviewedBy': 'Review executor',
      'review.comments': 'Review comments'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    return {
      'riskEvaluation.comments': {
        [FIELD_ADDED]: 'Risk evaluation comments set',
        [FIELD_CHANGED]: 'Risk evaluation comments changed',
        [FIELD_REMOVED]: 'Risk evaluation comments removed'
      },
      'riskEvaluation.prevLossExp': {
        [FIELD_ADDED]: 'Risk evaluation previous loss experience set',
        [FIELD_CHANGED]: 'Risk evaluation previous loss experience changed',
        [FIELD_REMOVED]: 'Risk evaluation previous loss experience removed'
      },
      'review.comments': {
        [FIELD_ADDED]: 'Review comments set',
        [FIELD_CHANGED]: 'Review comments changed',
        [FIELD_REMOVED]: 'Review comments removed'
      }
    };
  }

}
