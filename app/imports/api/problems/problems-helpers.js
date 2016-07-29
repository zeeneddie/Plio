import { Standards } from '../standards/standards.js';
import { WorkItems } from '../work-items/work-items.js';


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
  },

  getWorkItems() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).fetch();
  }

};
