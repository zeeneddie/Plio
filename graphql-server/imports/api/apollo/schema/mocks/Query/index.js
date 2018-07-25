import { times } from 'ramda';
import { random } from 'faker';

export default {
  GoalsQueryReturnType: (root, { limit }) => ({
    goals: times(() => ({}), limit || 20),
    totalCount: random.number({ min: limit }),
  }),
};
