import { WorkItems } from '/imports/share/collections/work-items.js';
import { isDueToday, isOverdue } from '/imports/share/helpers.js';
import Workflow from './Workflow.js';


export default class WorkItemWorkflow extends Workflow {

  _getStatus() {
    const workItem = this._doc;

    if (workItem.isCompleted === true) {
      return 3; // completed
    }

    const { targetDate } = workItem;
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return 2; // overdue
    }

    if (isDueToday(targetDate, timezone)) {
      return 1; // due today
    }

    return 0; // in progress
  }

  static get _collection() {
    return WorkItems;
  }

}
