import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';
import { times } from 'ramda';

import createContext from '../../../../share/utils/tests/createContext';
import { DocumentTypes } from '../../../../share/constants';

describe('Migration: move standards relations', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    jest.doMock('../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('up', async () => {
    const { up } = require('../20-move-standard-relations');

    await context.collections.Risks.rawCollection().insertMany([
      { standardsIds: [1, 2, 3] },
      { standardsIds: [4, 5, 6] },
    ]);
    await context.collections.NonConformities.rawCollection().insertMany([
      { standardsIds: [7, 8, 9] },
      { standardsIds: [4, 10, 11] },
    ]);

    await up();

    const relations = await context.collections.Relations.find().fetch();
    const risks = await context.collections.Risks.find().fetch();
    const nonconformities = await context.collections.NonConformities.find().fetch();

    expect(relations).toHaveLength(12);
    relations.forEach((relation) => {
      expect(relation.rel1).toMatchObject({
        documentType: expect.stringMatching(
          new RegExp(`${DocumentTypes.RISK}|${DocumentTypes.NON_CONFORMITY}`),
        ),
      });
      expect(relation.rel2).toMatchObject({
        documentId: expect.any(Number),
        documentType: DocumentTypes.STANDARD,
      });
    });
    expect(risks).toHaveLength(2);
    risks.forEach((risk) => {
      expect(risk).toEqual({ _id: expect.anything() });
    });
    expect(nonconformities).toHaveLength(2);
    nonconformities.forEach((nonconformity) => {
      expect(nonconformity).toEqual({ _id: expect.anything() });
    });
  });

  test('down', async () => {
    const { down } = require('../20-move-standard-relations');

    const riskIds = times(() => faker.random.uuid(), 3);
    const nonconformityIds = times(() => faker.random.uuid(), 3);
    const riskLinkedIds = times(() => faker.random.uuid(), 3);
    const nonconformityLinkedIds = times(() => faker.random.uuid(), 3);

    await Promise.all([
      ...riskIds.map(_id => context.collections.Risks.insert({ _id })),
      ...nonconformityIds.map(_id => context.collections.NonConformities.insert({ _id })),
      ...times(n => context.collections.Relations.insert({
        rel1: {
          documentId: riskIds[n],
          documentType: DocumentTypes.RISK,
        },
        rel2: {
          documentId: riskLinkedIds[n],
          documentType: DocumentTypes.STANDARD,
        },
      }), 3),
      ...times(n => context.collections.Relations.insert({
        rel1: {
          documentId: nonconformityIds[n],
          documentType: DocumentTypes.NON_CONFORMITY,
        },
        rel2: {
          documentId: nonconformityLinkedIds[n],
          documentType: DocumentTypes.STANDARD,
        },
      }), 3),
    ]);

    await down();

    await expect(context.collections.Risks.find().count()).resolves.toBe(riskIds.length);
    await expect(context.collections.Risks.findOne({ _id: riskIds[0] })).resolves.toEqual({
      _id: expect.anything(),
      standardsIds: [riskLinkedIds[0]],
    });
    await expect(context.collections.Risks.findOne({ _id: riskIds[1] })).resolves.toEqual({
      _id: expect.anything(),
      standardsIds: [riskLinkedIds[1]],
    });
    await expect(context.collections.Risks.findOne({ _id: riskIds[2] })).resolves.toEqual({
      _id: expect.anything(),
      standardsIds: [riskLinkedIds[2]],
    });

    await expect(context.collections.NonConformities.find().count())
      .resolves.toBe(nonconformityIds.length);
    await expect(context.collections.NonConformities
      .findOne({ _id: nonconformityIds[0] }))
      .resolves.toEqual({
        _id: expect.anything(),
        standardsIds: [nonconformityLinkedIds[0]],
      });
    await expect(context.collections.NonConformities
      .findOne({ _id: nonconformityIds[1] }))
      .resolves.toEqual({
        _id: expect.anything(),
        standardsIds: [nonconformityLinkedIds[1]],
      });
    await expect(context.collections.NonConformities
      .findOne({ _id: nonconformityIds[2] }))
      .resolves.toEqual({
        _id: expect.anything(),
        standardsIds: [nonconformityLinkedIds[2]],
      });

    await expect(context.collections.Relations.find().count()).resolves.toBe(0);
  });
});
