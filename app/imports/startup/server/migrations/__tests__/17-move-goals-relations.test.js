import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';
import { times } from 'ramda';

import createContext from '../../../../share/utils/tests/createContext';
import { DocumentTypes } from '../../../../share/constants';

describe('Migration: move goals relations', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    jest.doMock('../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('up', async () => {
    const { up } = require('../17-move-goals-relations');

    await context.collections.Goals.rawCollection().insertMany([
      { milestoneIds: [1, 2, 3], riskIds: [4, 5, 6] },
      { milestoneIds: [7, 8, 9], riskIds: [4, 10, 11] },
      {},
    ]);

    await up();

    const relations = await context.collections.Relations.find().fetch();
    const goals = await context.collections.Goals.find().fetch();

    expect(relations).toHaveLength(12);
    relations.forEach((relation) => {
      expect(relation.rel1).toMatchObject({
        documentType: DocumentTypes.GOAL,
      });
      expect(relation.rel2).toMatchObject({
        documentId: expect.any(Number),
        documentType: expect.stringMatching(
          new RegExp(`${DocumentTypes.MILESTONE}|${DocumentTypes.RISK}`),
        ),
      });
    });
    expect(goals).toHaveLength(3);
    goals.forEach((goal) => {
      expect(goal).toEqual({ _id: expect.anything() });
    });
  });

  test('down', async () => {
    const { down } = require('../17-move-goals-relations');

    const ids = times(() => faker.random.uuid(), 3);
    const linkedIds = times(() => faker.random.uuid(), 3);

    await Promise.all([
      ...ids.map(_id => context.collections.Goals.insert({ _id })),
      ...times(n => context.collections.Relations.insert({
        rel1: {
          documentId: ids[n],
          documentType: DocumentTypes.GOAL,
        },
        rel2: {
          documentId: linkedIds[n],
          documentType: [DocumentTypes.MILESTONE, DocumentTypes.RISK][n % 2],
        },
      }), 3),
    ]);

    await down();

    await expect(context.collections.Goals.find().count()).resolves.toBe(ids.length);
    await expect(context.collections.Goals.findOne({ _id: ids[0] })).resolves.toEqual({
      _id: expect.anything(),
      milestoneIds: [linkedIds[0]],
    });
    await expect(context.collections.Goals.findOne({ _id: ids[1] })).resolves.toEqual({
      _id: expect.anything(),
      riskIds: [linkedIds[1]],
    });
    await expect(context.collections.Goals.findOne({ _id: ids[2] })).resolves.toEqual({
      _id: expect.anything(),
      milestoneIds: [linkedIds[2]],
    });
    await expect(context.collections.Relations.find().count()).resolves.toBe(0);
  });
});
