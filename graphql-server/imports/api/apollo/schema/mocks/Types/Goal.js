import { date, random } from 'faker';

import { GoalColors } from '../../../../../share/constants';

export default {
  Goal: () => ({
    createdAt: () => date.past(),
    updatedAt: () => date.recent(),
    startDate: () => date.past(),
    endDate: () => date.future(),
    completedAt: () => date.recent(),
    deletedAt: () => date.recent(),
    color: () => random.arrayElement(Object.values(GoalColors)),
  }),
};
