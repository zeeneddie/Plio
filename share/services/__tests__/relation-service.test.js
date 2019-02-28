import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../utils/tests/createContext';
import RelationService from '../relation-service';

describe('Customer element service', () => {
  let context;
  const insertArgs = {
    rel1: {
      documentId: faker.random.uuid(),
      documentType: faker.random.word(),
    },
    rel2: {
      documentId: faker.random.uuid(),
      documentType: faker.random.word(),
    },
  };
  const insertTestData = () => Promise.all([
    context.collections.Relations.insert(insertArgs),
    context.collections.Relations.insert({
      rel1: insertArgs.rel2,
      rel2: insertArgs.rel1,
    }),
    context.collections.Relations.insert({
      rel1: insertArgs.rel1,
      rel2: {
        documentId: faker.random.uuid(),
        documentType: faker.random.word(),
      },
    }),
    context.collections.Relations.insert({
      rel1: insertArgs.rel2,
      rel2: {
        documentId: faker.random.uuid(),
        documentType: faker.random.word(),
      },
    }),
    context.collections.Relations.insert({
      rel1: {
        documentId: faker.random.uuid(),
        documentType: insertArgs.rel1.documentType,
      },
      rel2: {
        documentId: faker.random.uuid(),
        documentType: insertArgs.rel2.documentType,
      },
    }),
    context.collections.Relations.insert({
      rel1: {
        documentId: faker.random.uuid(),
        documentType: insertArgs.rel2.documentType,
      },
      rel2: {
        documentId: faker.random.uuid(),
        documentType: insertArgs.rel1.documentType,
      },
    }),
  ]);

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(async () => context.collections.Relations.remove({}));

  test('insert', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    const relation = await context.collections.Relations.findOne({ _id });

    expect(_id).toEqual(expect.any(String));
    expect(relation).toEqual({
      ...insertArgs,
      _id,
      createdBy: context.userId,
    });
  });

  test('delete (one to one)', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    let relation = await context.collections.Relations.findOne({ _id });
    const { rel1, rel2 } = relation;
    const args = {
      rel1: { documentId: rel1.documentId },
      rel2: { documentId: rel2.documentId },
    };

    await RelationService.delete(args, context);

    relation = await context.collections.Relations.findOne({ _id });

    expect(relation).toBe(null);
  });

  test('delete (one to one, reverse args)', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    let relation = await context.collections.Relations.findOne({ _id });
    const { rel1, rel2 } = relation;
    const args = {
      rel1: { documentId: rel2.documentId },
      rel2: { documentId: rel1.documentId },
    };

    await RelationService.delete(args, context);

    relation = await context.collections.Relations.findOne({ _id });

    expect(relation).toBe(null);
  });

  test('delete (one to many)', async () => {
    const ids = await insertTestData();
    const args = {
      rel1: insertArgs.rel1,
      rel2: {
        documentType: insertArgs.rel2.documentType,
      },
    };

    await expect(context.collections.Relations.find().count()).resolves.toBe(6);

    await RelationService.delete(args, context);

    await expect(context.collections.Relations.find().count()).resolves.toBe(4);
    await expect(context.collections.Relations.findOne({ _id: ids[0] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[1] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[2] })).resolves.not.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[3] })).resolves.not.toBeNull();
  });

  test('delete (one to many, reverse args)', async () => {
    await Promise.all([

    ]);
    const ids = await insertTestData();
    const args = {
      rel1: {
        documentType: insertArgs.rel1.documentType,
      },
      rel2: insertArgs.rel2,
    };

    await RelationService.delete(args, context);

    await expect(context.collections.Relations.find().count()).resolves.toBe(4);
    await expect(context.collections.Relations.findOne({ _id: ids[0] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[1] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[2] })).resolves.not.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[3] })).resolves.not.toBeNull();
  });

  test('delete (many to many)', async () => {
    const ids = await insertTestData();
    const args = {
      rel1: {
        documentType: insertArgs.rel1.documentType,
      },
      rel2: {
        documentType: insertArgs.rel2.documentType,
      },
    };

    await RelationService.delete(args, context);

    await expect(context.collections.Relations.find().count()).resolves.toBe(2);
    await expect(context.collections.Relations.findOne({ _id: ids[0] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[1] })).resolves.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[2] })).resolves.not.toBeNull();
    await expect(context.collections.Relations.findOne({ _id: ids[3] })).resolves.not.toBeNull();
  });
});
