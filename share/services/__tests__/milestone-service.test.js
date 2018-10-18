import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

describe('Milestone service', () => {
  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    jest.doMock('../../collections', () => ({
      Goals: new Mongo.Collection('goals'),
      Milestones: new Mongo.Collection('milestones'),
    }));
  });

  test('insert', async () => {
    const MilestoneService = require('../milestone-service').default;
    const { Goals } = require('../../collections');
    const organizationId = 1;
    const goalId = 2;
    const args = {
      organizationId,
      title: 'hello',
      description: 'world',
      completionTargetDate: new Date(),
      linkedTo: goalId,
    };

    await Goals.insert({ _id: goalId });

    const _id = await MilestoneService.insert(args);
    const milestone = await MilestoneService.collection.findOne({ _id });
    const { milestoneIds } = await Goals.findOne({ _id: goalId });

    expect(milestone).toMatchObject(args);
    expect(milestoneIds).toContain(milestone._id);
  });

  test('delete', async () => {
    const MilestoneService = require('../milestone-service').default;
    const args = {
      organizationId: 2,
      title: 'hello',
      description: 'world',
      completionTargetDate: new Date(),
      linkedTo: 3,
    };
    const context = { userId: 4 };
    const _id = await MilestoneService.insert(args);

    await MilestoneService.delete({ _id }, context);

    const milestone = await MilestoneService.collection.findOne({ _id });

    expect(milestone).toMatchObject({
      isDeleted: true,
      deletedBy: context.userId,
      deletedAt: expect.any(Date),
    });
  });

  test('remove', async () => {
    const MilestoneService = require('../milestone-service').default;
    const _id = await MilestoneService.collection.insert({});

    await MilestoneService.remove({ _id });

    const milestone = await MilestoneService.collection.findOne({ _id });

    expect(milestone).toBe(null);
  });

  test('restore', async () => {
    const MilestoneService = require('../milestone-service').default;
    const _id = await MilestoneService.collection.insert({
      isCompleted: true,
      isDeleted: true,
      deletedBy: 1,
      deletedAt: new Date(),
    });

    await MilestoneService.restore({ _id });

    const milestone = await MilestoneService.collection.findOne({ _id });

    expect(milestone).toEqual({
      _id,
      isDeleted: false,
      isCompleted: false,
    });
  });

  test('complete', async () => {
    const MilestoneService = require('../milestone-service').default;
    const context = { userId: 1 };
    const _id = await MilestoneService.insert({});

    await MilestoneService.complete({ _id }, context);

    const milestone = await MilestoneService.collection.findOne({ _id });

    expect(milestone).toMatchObject({
      isCompleted: true,
      completedBy: context.userId,
      completedAt: expect.any(Date),
    });
  });
});
