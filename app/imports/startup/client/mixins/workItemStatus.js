import { WorkItemsStore, WorkItemStatuses } from '../../../share/constants';

export default {
  getStatusName(status) {
    return WorkItemsStore.STATUSES[status];
  },
  getClassByStatus(status) {
    switch (status) {
      case WorkItemStatuses.IN_PROGRESS:
        return 'default';
      case WorkItemStatuses.DUE_TODAY:
        return 'warning';
      case WorkItemStatuses.OVERDUE:
        return 'danger';
      case WorkItemStatuses.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  },
  IN_PROGRESS: [WorkItemStatuses.IN_PROGRESS, WorkItemStatuses.DUE_TODAY, WorkItemStatuses.OVERDUE],
  COMPLETED: WorkItemStatuses.COMPLETED,
};
