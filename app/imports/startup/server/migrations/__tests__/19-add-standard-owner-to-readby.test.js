import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';
import { times } from 'ramda';

import createContext from '../../../../share/utils/tests/createContext';

describe('Migration: add standard owner to readBy', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    jest.doMock('../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('up', async () => {
    const { up } = require('../19-add-standard-owner-to-readby');
    const docs = times(() => ({ owner: faker.random.uuid() }), 3);

    await context.collections.Standards.rawCollection().insertMany(docs);
    await up();

    const standards = await context.collections.Standards.find().fetch();

    expect(standards).toEqual(docs.map(({ owner }) => ({
      _id: expect.anything(),
      owner,
      readBy: [owner],
    })));
  });

  test('down', async () => {
    const { down } = require('../19-add-standard-owner-to-readby');
    const docs = times(() => ({ readBy: [faker.random.uuid()] }), 3);

    await context.collections.Standards.rawCollection().insertMany(docs);
    await down();

    const standards = await context.collections.Standards.find().fetch();

    expect(standards).toEqual(docs.map(() => ({ _id: expect.anything() })));
  });
});
