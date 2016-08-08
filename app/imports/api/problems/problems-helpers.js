import { Standards } from '../standards/standards.js';


export default {

  isAnalysisCompleted() {
    const { status, completedAt, completedBy } = this.analysis || {};
    return (status === 1) && completedAt && completedBy;
  },

  areStandardsUpdated() {
    const { status, completedAt, completedBy } = this.updateOfStandards || {};
    return (status === 1) && completedAt && completedBy;
  },

  getLinkedStandards() {
    return Standards.find({ _id: { $in: this.standardsIds } }).fetch();
  },

  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  }

};
