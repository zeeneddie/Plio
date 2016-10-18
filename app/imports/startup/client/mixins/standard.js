import { FlowRouter } from 'meteor/kadira:flow-router';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { StandardFilters } from '/imports/api/constants.js';

export default {
  standardId() {
    return FlowRouter.getParam('standardId');
  },
  isActiveStandardFilter(filterId) {
    return this.activeStandardFilterId() === parseInt(filterId, 10);
  },
  activeStandardFilterId() {
    let id = parseInt(FlowRouter.getQueryParam('filter'));
    if (!StandardFilters[id]) {
      id = 1;
    }

    return id;
  },
  getStandardFilterLabel(id) {
    if (!StandardFilters[id]) {
      id = 1;
    }

    return StandardFilters[id];
  },
  currentStandard() {
    const _id =  FlowRouter.getParam('standardId');
    return Standards.findOne({ _id });
  },

  // Whether a given standard type exists
  standardTypeExists({ typeId }){
    return StandardTypes.find({ _id: typeId }).count() > 0;
  },
  _getStandardsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {},
    options = { sort: { title: 1 } }) {
    const query = { isDeleted, ...args, organizationId: this.organizationId() };
    return Standards.find(query, options);
  },
  _getStandardByQuery(filter = {}, options = { sort: { title: 1 } }) {
    const query = { ...filter, organizationId: this.organizationId() };
    return Standards.findOne(query, options);
  }
};