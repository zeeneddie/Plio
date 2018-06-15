import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Actions } from '/imports/share/collections/actions';
import { WorkItems } from '/imports/share/collections/work-items';
import {
  WorkItemsStore,
  ActionTypes,
} from '/imports/share/constants';
import { WorkInboxFilters } from '/imports/api/constants';
import { capitalize } from '/imports/share/helpers';
import { getTypeText } from '../../../api/work-items/helpers';

export default {
  getTypeText,
  getLinkedDocTypeText({ type, linkedDoc }) {
    const { TYPES } = WorkItemsStore;

    switch (type) {
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        // nonconformity type is non-conformity
        return `Closing of this ${linkedDoc.type}`.replace('-', '');
      default:
        return capitalize(this.getTypeText({ type, linkedDoc })
          .replace(/^(complete|verify)\s/i, ''));
    }
  },
  currentWorkItem() {
    return WorkItems.findOne({ _id: this.workItemId() });
  },
  workItemId() {
    return FlowRouter.getParam('workItemId');
  },
  queriedWorkItemId() {
    return FlowRouter.getQueryParam('id');
  },
  isActiveWorkInboxFilter(filterId) {
    return this.activeWorkInboxFilterId() === parseInt(filterId, 10);
  },
  activeWorkInboxFilterId() {
    const id = parseInt(FlowRouter.getQueryParam('filter'), 10);

    if (!WorkInboxFilters[id]) return 1;

    return id;
  },
  getWorkInboxFilterLabel(id) {
    if (!WorkInboxFilters[id]) return WorkInboxFilters[1].name;

    return WorkInboxFilters[id].name;
  },
  _getWorkItemsByQuery(
    {
      isDeleted = { $in: [null, false] },
      organizationId = this.organizationId(),
      ...args
    } = {},
    options = { sort: { createdAt: -1 } },
  ) {
    const query = { isDeleted, organizationId, ...args };
    return WorkItems.find(query, options);
  },
  _getWorkItemByQuery(filter, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter };
    return WorkItems.findOne(query, options);
  },
  _getActionsByQuery(
    { isDeleted = { $in: [null, false] }, ...args } = {},
    options = { sort: { createdAt: -1 } },
  ) {
    const query = { isDeleted, ...args, organizationId: this.organizationId() };
    return Actions.find(query, options);
  },
  _getActionByQuery(filter, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter, organizationId: this.organizationId() };
    return Actions.findOne(query, options);
  },
  _getNameByType(type) {
    switch (type) {
      case ActionTypes.CORRECTIVE_ACTION:
        return 'Corrective action';
      case ActionTypes.PREVENTATIVE_ACTION:
        return 'Preventative action';
      case ActionTypes.RISK_CONTROL:
        return 'Risk control';
      case ActionTypes.GENERAL_ACTION:
        return 'General action';
      default:
        return 'Action';
    }
  },
  _getQueryParams({ isCompleted, assigneeId }) {
    const assignee = assigneeId || Meteor.userId();
    return (userId) => {
      if (isCompleted) { // completed
        if (assignee === userId) {
          return { filter: 3 }; // My completed work
        }
        return { filter: 4 }; // Team completed work
      }
      if (assignee === userId) {
        return { filter: 1 }; // My current work
      }
      return { filter: 2 }; // Team current work
    };
  },
};
