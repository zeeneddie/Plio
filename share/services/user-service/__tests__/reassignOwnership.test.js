import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import reassignOwnership from '../reassignOwnership';

describe('UserService.reassignOwnership', () => {
  faker.seed(123);

  let context;
  let args;
  const organizationId = faker.random.uuid();
  const userId = faker.random.uuid();

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    args = { organizationId, userId: context.userId, ownerId: userId };
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('reassigns ownership of one document', async () => {
    const _id = await context.collections.Actions.insert({
      organizationId,
      ownerId: context.userId,
    });

    await reassignOwnership(args, context);

    await expect(context.collections.Actions.findOne({ _id })).resolves.toMatchObject({
      ownerId: userId,
    });
  });

  it('reassigns ownership of multiple documents', async () => {
    await context.collections.Actions.insert({ organizationId, ownerId: context.userId });
    await context.collections.Actions.insert({ organizationId, ownerId: context.userId });

    await reassignOwnership(args, context);

    const cursor = context.collections.Actions.find({ ownerId: userId });
    const count = await cursor.count();

    expect(count).toBe(2);
  });

  it('works with nested objects', async () => {
    const _id = await context.collections.NonConformities.insert({
      organizationId,
      improvementPlan: {
        owner: context.userId,
      },
    });

    await reassignOwnership(args, context);

    await expect(context.collections.NonConformities.findOne({ _id })).resolves.toMatchObject({
      improvementPlan: {
        owner: userId,
      },
    });
  });

  it('matches snapshot', async () => {
    const {
      Actions,
      LessonsLearned,
      NonConformities,
      Risks,
      Standards,
      WorkItems,
      Goals,
      KeyPartners,
      KeyActivities,
      KeyResources,
      CostLines,
      CustomerRelationships,
      Channels,
      ValuePropositions,
      CustomerSegments,
      RevenueStreams,
      Organizations,
    } = context.collections;

    await Promise.all([
      Actions.insert({
        organizationId,
        toBeCompletedBy: context.userId,
        completedBy: context.userId,
        toBeVerifiedBy: context.userId,
        verifiedBy: context.userId,
        ownerId: context.userId,
      }),
      LessonsLearned.insert({
        organizationId,
        owner: context.userId,
      }),
      NonConformities.insert({
        organizationId,
        ownerId: context.userId,
        originatorId: context.userId,
        improvementPlan: {
          owner: context.userId,
        },
        analysis: {
          executor: context.userId,
          completedBy: context.userId,
        },
        updateOfStandards: {
          executor: context.userId,
          completedBy: context.userId,
        },
      }),
      Risks.insert({
        organizationId,
        ownerId: context.userId,
        originatorId: context.userId,
        improvementPlan: {
          owner: context.userId,
        },
        analysis: {
          executor: context.userId,
          completedBy: context.userId,
        },
        updateOfStandards: {
          executor: context.userId,
          completedBy: context.userId,
        },
      }),
      Standards.insert({
        organizationId,
        owner: context.userId,
        improvementPlan: {
          owner: context.userId,
        },
      }),
      WorkItems.insert({
        organizationId,
        assigneeId: context.userId,
      }),
      Goals.insert({
        organizationId,
        ownerId: context.userId,
        completedBy: context.userId,
      }),
      KeyPartners.insert({
        organizationId,
        originatorId: context.userId,
      }),
      KeyActivities.insert({
        organizationId,
        originatorId: context.userId,
      }),
      KeyResources.insert({
        organizationId,
        originatorId: context.userId,
      }),
      CostLines.insert({
        organizationId,
        originatorId: context.userId,
      }),
      CustomerRelationships.insert({
        organizationId,
        originatorId: context.userId,
      }),
      Channels.insert({
        organizationId,
        originatorId: context.userId,
      }),
      ValuePropositions.insert({
        organizationId,
        originatorId: context.userId,
      }),
      CustomerSegments.insert({
        organizationId,
        originatorId: context.userId,
      }),
      RevenueStreams.insert({
        organizationId,
        originatorId: context.userId,
      }),
      Organizations.insert({
        _id: organizationId,
        review: {
          risks: {
            reviewerId: context.userId,
          },
          standards: {
            reviewerId: context.userId,
          },
        },
      }),
    ]);

    await reassignOwnership(args, context);

    const promises = [
      Actions,
      LessonsLearned,
      NonConformities,
      Risks,
      Standards,
      WorkItems,
      Goals,
      KeyPartners,
      KeyActivities,
      KeyResources,
      CostLines,
      CustomerRelationships,
      Channels,
      ValuePropositions,
      CustomerSegments,
      RevenueStreams,
    ]
      .map(collection => collection.find({ organizationId }).fetch())
      .concat(Organizations.find({ _id: organizationId }).fetch());
    const results = await Promise.all(promises);

    expect(results).toMatchSnapshot();
  });
});
