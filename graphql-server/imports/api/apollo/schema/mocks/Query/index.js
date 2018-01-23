import { times } from 'ramda';
import { random } from 'faker';

export default {
  GoalsQueryReturnType: (root, { limit }) => ({
    goals: times(() => ({}), limit),
    totalCount: random.number(limit),
  }),
};
