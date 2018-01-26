import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { resolver } from '../insertGoal';
import { GoalColors, GoalPriorities, Abbreviations } from '../../../../../../share/constants';

describe('insertGoal', () => {
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
      color: GoalColors[0],
      priority: GoalPriorities.MAJOR,
    };
    const context = {
      userId: 2,
      services: { GoalService },
    };
    const _id = await resolver(root, args, context);
    const goal = await GoalService.collection.findOne({ _id });
    const { sequentialId } = goal;

    expect(_id).toEqual(expect.any(String));
    expect(goal).toMatchObject(args);
    expect(sequentialId.startsWith(Abbreviations.GOAL)).toBe(true);
  });
});
