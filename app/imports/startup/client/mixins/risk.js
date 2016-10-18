import { FlowRouter } from 'meteor/kadira:flow-router';
import { Risks } from '/imports/api/risks/risks.js';
import { RiskFilters } from '/imports/api/constants.js';

export default {
  riskId() {
    return FlowRouter.getParam('riskId');
  },
  isActiveRiskFilter(filterId) {
    return this.activeRiskFilterId() === parseInt(filterId, 10);
  },
  activeRiskFilterId() {
    let id = parseInt(FlowRouter.getQueryParam('filter'));
    if (!RiskFilters[id]) {
      id = 1;
    }

    return id;
  },
  getRiskFilterLabel(id) {
    if (!RiskFilters[id]) {
      id = 1;
    }

    return RiskFilters[id];
  },
  currentRisk() {
    const _id = this.riskId();
    return Risks.findOne({ _id });
  },
  _getIsDeletedQuery() {
    return this.isActiveRiskFilter('deleted') ? { isDeleted: true } : { isDeleted: { $in: [null, false] } };
  },
  _getRisksByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
    const query = { isDeleted, ...args, organizationId: this.organizationId() };
    return Risks.find(query, options);
  },
  _getRiskByQuery(filter = {}, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter, organizationId: this.organizationId() };
    return Risks.findOne(query, options);
  }
}