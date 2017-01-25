import { ProblemsStatuses } from '/imports/share/constants';

export const problemsStatuses = Object.keys(ProblemsStatuses).map(status => ({
  number: status,
  title: ProblemsStatuses[status],
}));
