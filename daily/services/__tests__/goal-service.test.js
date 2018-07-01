import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import { GoalColors, GoalPriorities, Abbreviations } from '../../constants';
import MilestoneService from '../milestone-service';

jest.mock('../milestone-service', () => ({
  delete: jest.fn(),
  restore: jest.fn(),
}));

describe('Goal service', () => {
  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    jest.doMock('../../collections', () => ({
      Goals: new Mongo.Collection('goals'),
      WorkItems: new Mongo.Collection('workItems'),
      Milestones: new Mongo.Collection('milestones'),
    }));
  });

  test('insert', async () => {
    const GoalService = require('../goal-service').default;
    const args = {
      organizationId: 1,
      title: 'hello',
      ownerId: 2,
      startDate: new Date(),
      endDate: new Date(),
      color: GoalColors.PINK,
      priority: GoalPriorities.MAJOR,
    };
    const _id = await GoalService.insert(args);
    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toMatchObject(args);
    expect(goal.sequentialId.startsWith(Abbreviations.GOAL)).toBe(true);
  });

  test('complete', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({});
    const userId = 1;
    const completionComment = 'hello world';

    await GoalService.complete({ _id, completionComment }, { userId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toMatchObject({
      isCompleted: true,
      completedBy: userId,
      completedAt: expect.any(Date),
      completionComment,
    });
  });

  test('undoCompletion', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({
      isCompleted: true,
      completedBy: 1,
      completedAt: new Date(),
      completionComment: 'hello world',
    });

    await GoalService.undoCompletion({ _id });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      isCompleted: false,
    });
  });

  test('linkMilestone', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({});
    const milestoneId = 1;

    await GoalService.linkMilestone({ _id, milestoneId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      milestoneIds: [milestoneId],
    });
  });

  test('linkFile', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({});
    const fileId = 1;

    await GoalService.linkFile({ _id, fileId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      fileIds: [fileId],
    });
  });

  test('unlinkFile', async () => {
    const GoalService = require('../goal-service').default;
    const fileId = 1;
    const _id = await GoalService.collection.insert({ fileIds: [fileId] });

    await GoalService.unlinkFile({ _id, fileId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      fileIds: [],
    });
  });

  test('linkRisk', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({});
    const riskId = 1;

    await GoalService.linkRisk({ _id, riskId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      riskIds: [riskId],
    });
  });

  test('addToNotify', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({});
    const userId = 1;

    await GoalService.addToNotify({ _id, userId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      notify: [userId],
    });
  });

  test('removeFromNotify', async () => {
    const GoalService = require('../goal-service').default;
    const userId = 1;
    const _id = await GoalService.collection.insert({ notify: [userId] });

    await GoalService.removeFromNotify({ _id, userId });

    const goal = await GoalService.collection.findOne({ _id });

    expect(goal).toEqual({
      _id,
      notify: [],
    });
  });

  test('restore', async () => {
    const GoalService = require('../goal-service').default;
    const _id = await GoalService.collection.insert({ milestoneIds: [2, 3] });

    await GoalService.delete({ _id }, { userId: 1 });
    await GoalService.restore({ _id });

    const goal = await GoalService.collection.findOne({ _id });

    expect(MilestoneService.delete).toHaveBeenCalledTimes(2);
    expect(MilestoneService.restore).toHaveBeenCalledTimes(2);

    expect(goal).toMatchObject({
      isDeleted: false,
      isCompleted: false,
    });
  });

  test('remove', async () => {
    const GoalService = require('../goal-service').default;
    const ActionService = require('../action-service').default;
    const LessonsLearned = new Mongo.Collection('lessons');
    const Milestones = new Mongo.Collection('milestones');
    const Risks = new Mongo.Collection('risks');
    const Files = new Mongo.Collection('files');
    const Actions = new Mongo.Collection('actions');
    const _id = 1;
    const milestoneIds = [2];
    const riskIds = [3];
    const fileIds = [4];
    const goal = {
      _id,
      milestoneIds,
      riskIds,
      fileIds,
    };

    ActionService.collection = Actions;

    const context = {
      goal,
      services: { ActionService },
      collections: {
        LessonsLearned,
        Milestones,
        Files,
        Actions,
      },
    };

    await Promise.all([
      Milestones.insert({ _id: goal.milestoneIds[0] }),
      Risks.insert({ _id: goal.riskIds[0] }),
      Files.insert({ _id: goal.fileIds[0] }),
      LessonsLearned.insert({ linkedTo: [{ documentId: _id }] }),
      LessonsLearned.insert({ linkedTo: [{ documentId: _id }] }),
      Actions.insert({ linkedTo: [{ documentId: _id }] }),
      Actions.insert({ linkedTo: [{ documentId: _id }] }),
    ]);

    await GoalService.remove({ _id: goal._id }, context);

    await expect(Milestones.find().count()).resolves.toBe(0);
    await expect(Files.find().count()).resolves.toBe(0);
    await expect(LessonsLearned.find().count()).resolves.toBe(0);
    await expect(Risks.find().count()).resolves.toBe(riskIds.length);
    await expect(Actions.find().count()).resolves.toBe(2);
    await expect(Actions.find({ 'linkedTo.documentId': _id }).count()).resolves.toBe(0);
  });
});
