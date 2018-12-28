import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import {
  removeFiles,
  removeLessons,
  removeRelations,
  unlinkActions,
  removeMilestones,
} from '../cleanup';
import { DocumentTypes } from '../../../constants';

describe('services/util/cleanup', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('removes relations', async () => {
    const documentId = faker.random.uuid();
    const doc = { _id: documentId };

    await Promise.all([
      context.collections.Relations.insert({
        rel1: {
          documentId,
        },
        rel2: {
          documentId: faker.random.uuid(),
        },
      }),
      context.collections.Relations.insert({
        rel1: {
          documentId: faker.random.uuid(),
        },
        rel2: {
          documentId,
        },
      }),
    ]);

    await removeRelations(doc, context);

    expect(context.collections.Relations.remove).toHaveBeenCalledTimes(1);
    await expect(context.collections.Relations.find().count()).resolves.toBe(0);
  });

  it('removes files', async () => {
    const fileIds = await Promise.all([
      context.collections.Files.insert({}),
      context.collections.Files.insert({}),
    ]);
    const doc = { fileIds };

    await removeFiles(doc, context);

    expect(context.collections.Files.remove).toHaveBeenCalledTimes(1);
    await expect(context.collections.Files.find().count()).resolves.toBe(0);
  });

  it('removes lessons', async () => {
    const documentId = faker.random.uuid();
    const doc = { _id: documentId };
    await Promise.all([
      context.collections.LessonsLearned.insert({ documentId }),
      context.collections.LessonsLearned.insert({ documentId }),
    ]);

    await removeLessons(doc, context);

    expect(context.collections.LessonsLearned.remove).toHaveBeenCalledTimes(1);
    await expect(context.collections.LessonsLearned.find().count()).resolves.toBe(0);
  });

  it('unlinks actions', async () => {
    context.services.ActionService.unlinkDocument = jest.fn();
    const documentId = faker.random.uuid();
    const doc = { _id: documentId };
    const ids = await Promise.all([
      context.collections.Actions.insert({
        linkedTo: [{ documentId }],
      }),
      context.collections.Actions.insert({
        linkedTo: [{ documentId }],
      }),
    ]);

    await unlinkActions(doc, context);

    expect(context.services.ActionService.unlinkDocument).toHaveBeenCalledTimes(2);
    expect(context.services.ActionService.unlinkDocument).toHaveBeenLastCalledWith({
      _id: ids[1],
      documentId,
    });
  });

  it('removes milestones', async () => {
    const doc = { _id: faker.random.uuid() };
    const ids = await Promise.all([
      context.collections.Milestones.insert({}),
      context.collections.Milestones.insert({}),
      context.collections.Milestones.insert({}),
    ]);
    await Promise.all([
      context.collections.Relations.insert({
        rel1: {
          documentId: ids[0],
          documentType: DocumentTypes.MILESTONE,
        },
        rel2: {
          documentId: doc._id,
          documentType: faker.random.word(),
        },
      }),
      context.collections.Relations.insert({
        rel1: {
          documentId: doc._id,
          documentType: faker.random.word(),
        },
        rel2: {
          documentId: ids[1],
          documentType: DocumentTypes.MILESTONE,
        },
      }),
    ]);

    await removeMilestones(doc, context);

    expect(context.collections.Milestones.remove).toHaveBeenCalledTimes(1);
    await expect(context.collections.Milestones.find().count()).resolves.toBe(1);
    await expect(context.collections.Milestones.findOne({ _id: ids[2] })).resolves.toBeTruthy();
  });
});
