import { FlowRouter } from 'meteor/kadira:flow-router';
import { Actions } from '/imports/share/collections/actions.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import {
  WorkItemsStore,
  ProblemTypes,
  ActionTypes,
} from '/imports/share/constants.js';
import { AnalysisTitles, ActionTitles, WorkInboxFilters } from '/imports/api/constants.js';
import { capitalize, lowercase } from '/imports/share/helpers';
import { propEq } from '/imports/api/helpers';

const {
  riskAnalysis,
  rootCauseAnalysis,
  updateOfRiskRecord,
  updateOfStandards,
} = AnalysisTitles;

export default {
  getTypeText({ type, linkedDoc }) {
    const result = ((() => {
      let title;
      const COMPLETE = 'Complete';
      const VERIFY = 'Verify';
      const getText = (action, text) => `${action} ${lowercase(text)}`;
      switch (linkedDoc && type) {
        case WorkItemsStore.TYPES.COMPLETE_ANALYSIS:
          title = linkedDoc.type === ProblemTypes.RISK
            ? riskAnalysis
            : rootCauseAnalysis;
          return getText(COMPLETE, title);
        case WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
          title = linkedDoc.type === ProblemTypes.RISK
            ? updateOfRiskRecord
            : updateOfStandards;
          return getText(COMPLETE, title);
        case WorkItemsStore.TYPES.COMPLETE_ACTION:
          title = ActionTitles[linkedDoc.type];
          return getText(COMPLETE, title);
        case WorkItemsStore.TYPES.VERIFY_ACTION:
          title = ActionTitles[linkedDoc.type];
          return getText(VERIFY, title);
        default:
          return type;
      }
    })());

    return result;
  },
  getLinkedDocTypeText({ type, linkedDoc }) {
    return capitalize(this.getTypeText({ type, linkedDoc }).replace(/^(complete|verify)\s/i, ''));
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
    options = { sort: { createdAt: -1 } }
  ) {
    const query = { isDeleted, organizationId, ...args };
    return WorkItems.find(query, options);
  },
  _getWorkItemByQuery(filter, options = { sort: { createdAt: -1 } }) {
    const query = { ...filter };
    return WorkItems.findOne(query, options);
  },
  _getActionsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
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
        break;
      case ActionTypes.PREVENTATIVE_ACTION:
        return 'Preventative action';
        break;
      case ActionTypes.RISK_CONTROL:
        return 'Risk control';
        break;
    }
  },
  _getQueryParams({ isCompleted, assigneeId }) {
    assigneeId = assigneeId || Meteor.userId();
    return (userId) => {
      if (isCompleted) { // completed
        if (assigneeId === userId) {
          return { filter: 3 }; // My completed work
        } else {
          return { filter: 4 }; // Team completed work
        }
      } else {
        if (assigneeId === userId) {
          return { filter: 1 }; // My current work
        } else {
          return { filter: 2 }; // Team current work
        }
      }
    };
  },
  _splitActionsByType(actions) {
    const propEqType = propEq('type');
    return {
      [ActionTypes.CORRECTIVE_ACTION]:
        actions.filter(propEqType(ActionTypes.CORRECTIVE_ACTION)),
      [ActionTypes.PREVENTATIVE_ACTION]:
        actions.filter(propEqType(ActionTypes.PREVENTATIVE_ACTION)),
      [ActionTypes.RISK_CONTROL]:
        actions.filter(propEqType(ActionTypes.RISK_CONTROL)),
    };
  },
};
