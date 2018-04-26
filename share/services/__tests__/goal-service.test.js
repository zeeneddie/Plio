import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import { GoalColors, GoalPriorities, Abbreviations } from '../../constants';

describe('Goal service', () => {
  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    jest.doMock('../../collections', () => ({
      Goals: new Mongo.Collection('goals'),
      WorkItems: new Mongo.Collection('workItems'),
    }));
  });

  describe('insert', () => {
    it('inserts a new goal', async () => {
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
  });

  describe('remove', () => {
    it('removes goal and removes/unlinks all linked documents', async () => {
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
});
