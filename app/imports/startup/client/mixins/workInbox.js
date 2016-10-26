import { FlowRouter } from 'meteor/kadira:flow-router';
import { Actions } from '/imports/share/collections/actions.js';
import { ActionTypes } from '/imports/share/constants.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { WorkInboxFilters } from '/imports/api/constants.js';
import { WorkItemsStore, ProblemTypes } from '/imports/share/constants.js';
import { AnalysisTitles } from '/imports/api/constants.js';
import { capitalize } from '/imports/share/helpers';

export default {
  getTypeText({ type, linkedDoc }) {
    if (type === WorkItemsStore.TYPES.COMPLETE_ANALYSIS) {
      if (linkedDoc) {
        if (linkedDoc.type === ProblemTypes.RISK) {
          return capitalize(AnalysisTitles.riskAnalysis);
        } else {
          return capitalize(AnalysisTitles.rootCauseAnalysis);
        }
      }
    } else if (type === WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_DOCUMENTS) {
      if (linkedDoc) {
        if (linkedDoc.type === ProblemTypes.RISK) {
          return capitalize(AnalysisTitles.updateOfRiskRecord);
        } else {
          return capitalize(AnalysisTitles.updateOfStandards);
        }
      }
    }
    
    return capitalize(type);
  },
  getLinkedDocTypeText({ type, linkedDoc }) {
    const typeText = this.getTypeText({ type, linkedDoc });
    return capitalize(typeText.substr(typeText.indexOf(' ') + 1));
  },
  currentWorkItem(){
    return WorkItems.findOne({ _id: this.workItemId() });
  },
  workItemId() {
    return FlowRouter.getParam('workItemId');
  },
  isActiveWorkInboxFilter(filterId) {
    return this.activeWorkInboxFilterId() === parseInt(filterId, 10);
  },
  activeWorkInboxFilterId() {
    let id = parseInt(FlowRouter.getQueryParam('filter'), 10);
    if (!WorkInboxFilters[id]) {
      id = 1;
    }

    return id;
  },
  getWorkInboxFilterLabel(id) {
    if (!WorkInboxFilters[id]) {
      id = 1;
    }

    return WorkInboxFilters[id];
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
  _getQueryParams({ isCompleted, assigneeId = Meteor.userId() }) {
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
  }
};
