import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../utils/tests/createContext';
import MilestoneService from '../milestone-service';
import { removeRelations } from '../util/cleanup';

jest.mock('../util/cleanup');

describe('Milestone service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('insert', async () => {
    const organizationId = faker.random.uuid();
    const args = {
      organizationId,
      title: faker.random.word(),
      description: faker.random.words(),
      completionTargetDate: new Date(),
    };

    const _id = await MilestoneService.insert(args, context);
    const milestone = await context.collections.Milestones.findOne({ _id });

    expect(milestone).toEqual({
      ...args,
      _id,
      notify: [context.userId],
      createdBy: context.userId,
    });
  });

  test('remove', async () => {
    const _id = await context.collections.Milestones.insert({});
    const milestone = await context.collections.Milestones.findOne({ _id });

    await MilestoneService.remove({ _id }, { ...context, milestone });

    expect(removeRelations).toHaveBeenCalledWith(milestone, context);
    await expect(context.collections.Milestones.findOne({ _id })).resolves.toBe(null);
  });

  test('restore', async () => {
    const _id = await context.collections.Milestones.insert({
      isCompleted: true,
      completedBy: new Date(),
      completionComment: faker.random.words(),
    });

    await MilestoneService.restore({ _id }, context);

    const milestone = await context.collections.Milestones.findOne({ _id });

    expect(milestone).toEqual({
      _id,
      isCompleted: false,
      updatedBy: context.userId,
    });
  });

  test('complete', async () => {
    const _id = await context.collections.Milestones.insert({});

    await MilestoneService.complete({ _id }, context);

    const milestone = await context.collections.Milestones.findOne({ _id });

    expect(milestone).toMatchObject({
      isCompleted: true,
      completedBy: context.userId,
      completedAt: expect.any(Date),
    });
  });
});
