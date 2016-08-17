import moment from 'moment-timezone';

import {
  CollectionNames,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions
} from '../../constants.js';
import { RiskTypes } from '../../risk-types/risk-types.js';
import ProblemUpdateAudit from '../../problems/server/ProblemUpdateAudit.js';


export default class RiskUpdateAudit extends ProblemUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'review':
          this._reviewChanged(diff);
          break;
        case 'review.reviewedBy':
          this._userChanged(diff);
          break;
        case 'riskEvaluation':
          this._riskEvaluationChanged(diff);
          break;
        case 'riskEvaluation.decision':
          this._riskEvaluationDecisionChanged(diff);
          break;
        case 'riskEvaluation.priority':
          this._riskEvaluationPriorityChanged(diff);
          break;
        case 'scores':
          this._scoringChanged(diff);
          break;
        case 'typeId':
          this._typeChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _reviewChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, oldValue, newValue } = diff;
    let review, message;

    if (kind === FIELD_ADDED) {
      review = newValue;
      message = 'Review added: [reviewDesc]';
    } else if (kind === FIELD_REMOVED) {
      review = oldValue;
      message = 'Review removed: [reviewDesc]';
    }

    if (!(message && _(review).isObject())) {
      return;
    }

    const { reviewedAt, reviewedBy } = review;
    const reviewDesc = [];

    if (reviewedBy !== undefined) {
      const author = Meteor.users.findOne({ _id: reviewedBy });
      const authorName = (author && author.fullNameOrEmail()) || reviewedBy;
      reviewDesc.push(`author - ${authorName}`);
    }

    if (reviewedAt !== undefined) {
      const date = moment(reviewedAt).tz('UTC').toString();
      reviewDesc.push(`reviewed on ${date}`);
    }

    if (reviewDesc.length) {
      message = message.replace('[reviewDesc]', reviewDesc.join(', '));
    } else {
      message = /^(Review (?:added|removed))/.exec(message)[1];
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _riskEvaluationChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, oldValue, newValue } = diff;
    let riskEval, message;

    if (kind === FIELD_ADDED) {
      riskEval = newValue;
      message = 'Risk evaluation added: [riskEvalDesc]';
    } else if (kind === FIELD_REMOVED) {
      riskEval = oldValue;
      message = 'Risk evaluation removed: [riskEvalDesc]';
    }

    if (!(message && _(riskEval).isObject())) {
      return;
    }

    const { decision, priority } = riskEval;
    const riskEvalDesc = [];

    if (decision !== undefined) {
      riskEvalDesc.push(`decision - "${RiskEvaluationDecisions[decision]}"`);
    }

    if (priority !== undefined) {
      riskEvalDesc.push(`priority - "${RiskEvaluationPriorities[priority]}"`);
    }

    if (riskEvalDesc.length) {
      message = message.replace('[riskEvalDesc]', riskEvalDesc.join(', '));
    } else {
      message = /^(Risk evaluation (?:added|removed))/.exec(message)[1];
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _riskEvaluationDecisionChanged(diff) {
    this._prettifyValues(diff, val => RiskEvaluationDecisions[val]);
  }

  _riskEvaluationPriorityChanged(diff) {
    this._prettifyValues(diff, val => RiskEvaluationPriorities[val]);
  }

  _scoringChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, item:score } = diff;
    let message;

    if (kind === ITEM_ADDED) {
      message = 'Risk score added: [scoreDesc]';
    } else if (kind === ITEM_REMOVED) {
      message = 'Risk score removed: [scoreDesc]';
    }

    if (!(message && _(score).isObject())) {
      return;
    }

    const { value, scoredAt, scoredBy } = score;
    const scoreDesc = [];

    if (value !== undefined) {
      scoreDesc.push(`value="${value}"`);
    }

    if (scoredBy !== undefined) {
      const user = Meteor.users.findOne({ _id: scoredBy });
      const userName = (user && user.fullNameOrEmail()) || scoredBy;
      scoreDesc.push(`scored by ${userName}`);
    }

    if (scoredAt !== undefined) {
      const date = moment(scoredAt).tz('UTC').toString();
      scoreDesc.push(`scored on ${date}`);
    }

    if (scoreDesc.length) {
      message = message.replace('[scoreDesc]', scoreDesc.join(', '));
    } else {
      message = /^(Risk score (?:added|removed))/.exec(message)[1];
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _typeChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const riskType = RiskTypes.findOne({ _id: val });
      return riskType && riskType.title;
    });
  }

  static get _collection() {
    return CollectionNames.RISKS;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      review: 'Review',
      'review.comments': 'Review comments',
      'review.reviewedAt': 'Review date',
      'review.reviewedBy': 'Review executor',
      'review.status': 'Review status',
      riskEvaluation: 'Risk evaluation',
      'riskEvaluation.comments': 'Risk evaluation comments',
      'riskEvaluation.decision': 'Risk evaluation treatment decision',
      'riskEvaluation.prevLossExp': 'Risk evaluation previous loss experience',
      'riskEvaluation.priority': 'Risk evaluation treatment priority',
      scores: 'Risk scoring',
      'scores.$.rowId': 'Risk score row ID',
      'scores.$.scoredAt': 'Risk score date',
      'scores.$.scoredBy': 'Risk score executor',
      'scores.$.value': 'Risk score value',
      typeId: 'Risk type'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
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

    return _(messages).extend(super._messages);
  }

}
