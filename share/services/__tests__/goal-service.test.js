import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import { GoalColors, GoalPriorities, Abbreviations } from '../../constants';
import createContext from '../../utils/tests/createContext';
import GoalService from '../goal-service';
import { generateSerialNumber } from '../../helpers';

jest.mock('../../helpers', () => ({
  generateSerialNumber: jest.fn(),
}));

describe('Goal service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('insert', async () => {
    const args = {
      organizationId: faker.random.uuid(),
      title: faker.random.word(),
      description: faker.random.words(),
      ownerId: faker.random.uuid(),
      startDate: new Date(),
      endDate: new Date(),
      color: GoalColors.YELLOW,
      priority: GoalPriorities.MAJOR,
    };
    const _id = await GoalService.insert(args, context);
    const goal = await context.collections.Goals.findOne({ _id });

    expect(goal).toMatchObject({
      ...args,
      createdBy: context.userId,
    });
    expect(generateSerialNumber).toHaveBeenCalled();
    expect(goal.sequentialId.startsWith(Abbreviations.GOAL)).toBe(true);
  });

  test('complete', async () => {
    const _id = await context.collections.Goals.insert({});
    const args = {
      _id,
      completionComment: faker.random.words(),
    };

    await GoalService.complete(args, context);

    const goal = await context.collections.Goals.findOne({ _id });

    expect(goal).toEqual({
      ...args,
      isCompleted: true,
      completedBy: context.userId,
      completedAt: expect.any(Date),
      updatedBy: context.userId,
    });
  });

  test('undoCompletion', async () => {
    const _id = await context.collections.Goals.insert({
      isCompleted: true,
      completedBy: context.userId,
      completedAt: new Date(),
      completionComment: faker.random.words(),
    });

    await GoalService.undoCompletion({ _id }, context);

    const goal = await context.collections.Goals.findOne({ _id });

    expect(goal).toEqual({
      _id,
      isCompleted: false,
      updatedBy: context.userId,
    });
  });

  test('restore', async () => {
    const _id = await context.collections.Goals.insert({
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: context.userId,
      isCompleted: true,
      completedAt: new Date(),
      completedBy: context.userId,
    });

    await GoalService.restore({ _id }, context);

    const goal = await context.collections.Goals.findOne({ _id });

    expect(goal).toEqual({
      _id,
      updatedBy: context.userId,
      isDeleted: false,
      isCompleted: false,
    });
  });

  test('remove', async () => {
    const _id = await context.collections.Goals.insert({});
    const goal = await context.collections.Goals.findOne({ _id });

    await GoalService.remove({ _id }, { ...context, goal });

    await expect(context.collections.Goals.findOne({ _id })).resolves.toBe(null);
  });
});
