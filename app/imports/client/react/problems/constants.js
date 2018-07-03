import { ProblemsStatuses } from '../../../share/constants';

export const problemsStatuses = Object.keys(ProblemsStatuses).map(status => ({
  value: parseInt(status, 10),
  text: ProblemsStatuses[status],
}));
