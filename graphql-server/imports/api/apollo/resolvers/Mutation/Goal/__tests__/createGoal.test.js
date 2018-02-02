import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { resolver } from '../createGoal';
import { GoalColors, GoalPriorities, Abbreviations } from '../../../../../../share/constants';

describe('createGoal', () => {
  beforeAll(() => __setupDB());
  afterAll(() => __closeDB());

  it('inserts a new goal', async () => {
    jest.doMock('../../../../../../share/collections', jest.fn(() => ({
      Goals: new Mongo.Collection('goals'),
    })));
    const GoalService = require('../../../../../../share/services/goal-service').default;
    const root = {};
    const args = {
      organizationId: 1,
      title: 'hello',
      ownerId: 2,
      startDate: new Date(),
      endDate: new Date(),
      color: GoalColors.PINK,
      priority: GoalPriorities.MAJOR,
    };
    const context = {
      userId: 2,
      services: { GoalService },
      collections: { Goals: GoalService.collection },
    };
    const { goal } = await resolver(root, args, context);
    const { sequentialId } = goal;

    expect(goal).toMatchObject(args);
    expect(sequentialId.startsWith(Abbreviations.GOAL)).toBe(true);
  });
});
