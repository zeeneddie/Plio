import { FlowRouter } from 'meteor/kadira:flow-router';
import { NonConformities } from '../../../share/collections';
import { NonConformityFilters, AnalysisTitles } from '../../../api/constants';
import { ProblemTypes } from '../../../share/constants';

export default {
  NCId() {
    return FlowRouter.getParam('urlItemId');
  },
  isActiveNCFilter(filterId) {
    return this.activeNCFilterId() === parseInt(filterId, 10);
  },
  activeNCFilterId() {
    const id = parseInt(FlowRouter.getQueryParam('filter'), 10);

    if (!NonConformityFilters[id]) return 1;

    return id;
  },
  getNCFilterLabel(id) {
    if (!NonConformityFilters[id]) return NonConformityFilters[1].name;

    return NonConformityFilters[id].name;
  },
  currentNC() {
    const _id = this.NCId();
    return NonConformities.findOne({ _id });
  },
  getNameByType(doc) {
    if (this.isPG(doc)) {
      return 'Potential gain';
    }

    return 'Nonconformity';
  },
  isPG({ type } = {}) {
    if (type === ProblemTypes.POTENTIAL_GAIN) {
      return true;
    }
    return false;
  },
  getAnalysisTitleByType(doc) {
    return this.isPG(doc) ? AnalysisTitles.potentialGainAnalysis : AnalysisTitles.rootCauseAnalysis;
  },
  _getNCsByQuery({
    isDeleted = { $in: [null, false] },
    ...args
  } = {},
  options = { sort: { createdAt: -1 } }) {
    const query = { isDeleted, ...args, organizationId: this.organizationId() };
    return NonConformities.find(query, options);
  },
  _getNCByQuery(filter = {}, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter, organizationId: this.organizationId() };
    return NonConformities.findOne(query, options);
  },
};
