import { date } from 'faker';

export default {
  Milestone: () => ({
    createdAt: () => date.past(),
    updatedAt: () => date.recent(),
    startDate: () => date.past(),
    endDate: () => date.future(),
    completedAt: () => date.recent(),
    completionTargetDate: () => date.future(),
  }),
};
