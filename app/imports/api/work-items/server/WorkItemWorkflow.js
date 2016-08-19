import { WorkItems } from '../work-items.js';
import { ActionTypes, ProblemTypes, WorkItemsStore } from '../../constants.js';
import { isDueToday, isOverdue } from '../../checkers.js';

import Workflow from '/imports/core/server/Workflow.js';


export default class WorkItemWorkflow extends Workflow {

  _getStatus() {
    const workItem = this._doc;

    if (workItem.isCompleted === true) {
      return 3; // completed
    }

    const { TYPES:WorkItemTypes } = WorkItemsStore;
    const { type:workItemType } = workItem;
    const { status:linkedDocStatus } = workItem.getLinkedDoc();

    const statuses = {
      [WorkItemTypes.COMPLETE_ACTION]: {
        dueToday: 2, // In progress - due for completion today
        overdue: 3 // In progress - completion overdue
      },
      [WorkItemTypes.VERIFY_ACTION]: {
        dueToday: 5, // In progress - completed, verification due today
        overdue: 6 // In progress - completed, verification overdue
      },
      [WorkItemTypes.COMPLETE_ANALYSIS]: {
        dueToday: 4, // Open - analysis due today
        overdue: 5 // Open - analysis overdue
      },
      [WorkItemTypes.COMPLETE_UPDATE_OF_STANDARDS]: {
        dueToday: 15, // Open - action(s) verified as effective, update of standard(s) due today
        overdue: 16 // Open - action(s) verified as effective, update of standard(s) past due
      }
    };

    if (linkedDocStatus === statuses[workItemType]['overdue']) {
      return 2; // overdue
    }

    if (linkedDocStatus === statuses[workItemType]['dueToday']) {
      return 1; // due today
    }

    return 0; // in progress
  }

  static _collection() {
    return WorkItems;
  }

}
