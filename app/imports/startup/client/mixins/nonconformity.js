import { FlowRouter } from 'meteor/kadira:flow-router';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { NonConformityFilters } from '/imports/api/constants.js';

export default {
  NCId() {
    return FlowRouter.getParam('nonconformityId');
  },
  isActiveNCFilter(filterId) {
    return this.activeNCFilterId() === parseInt(filterId, 10);
  },
  activeNCFilterId() {
    let id = parseInt(FlowRouter.getQueryParam('filter'));
    if (!NonConformityFilters[id]) {
      id = 1;
    }

    return id;
  },
  getNCFilterLabel(id) {
    if (!NonConformityFilters[id]) {
      id = 1;
    }

    return NonConformityFilters[id];
  },
  currentNC() {
    const _id = this.NCId();
    return NonConformities.findOne({ _id });
  },
  _getNCsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
    const query = { isDeleted, ...args, organizationId: this.organizationId() };
    return NonConformities.find(query, options);
  },
  _getNCByQuery(filter = {}, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter, organizationId: this.organizationId() };
    return NonConformities.findOne(query, options);
  }
};