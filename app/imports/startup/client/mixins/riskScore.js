import { riskScoreTypes } from '/imports/share/constants.js';

export default {
  sortScores(scores, direction) {
    return Array.from(scores || []).sort(({ scoredAt: sc1 }, { scoredAt: sc2 }) => {
      if (direction === -1) {
        return sc2 - sc1;
      }
      return sc1 - sc2;
    });
  },
  getPrimaryScore(scores) {
    return _.find(scores, score => score && score.scoreTypeId === riskScoreTypes.residual.id) || _.find(scores, score => score && score.scoreTypeId === riskScoreTypes.inherent.id) || {};
  },
  getScoreTypeAdjLabel(scoreTypeId) {
    const riskScoreType = riskScoreTypes[scoreTypeId];
    return riskScoreType && riskScoreType.adj;
  },
  getScoreTypeLabel(scoreTypeId) {
    const riskScoreType = riskScoreTypes[scoreTypeId];
    return riskScoreType && riskScoreType.label;
  },
  getNameByScore(score) {
    if (score > 0 && score <= 20) {
      return 'Low';
    } else if (score > 20 && score <= 45) {
      return 'Medium';
    } else if (score > 45 && score <= 66) {
      return 'High';
    }
    return 'Very high';
  },
  getClassByScore(score) {
    if (score >= 0 && score < 25) {
      return 'vlow';
    } else if (score >= 25 && score < 50) {
      return 'low';
    } else if (score >= 50 && score < 75) {
      return 'medium';
    }
    return 'high';
  },
};
