import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';
import { times } from 'ramda';

import createContext from '../../../../share/utils/tests/createContext';

describe('Migration: Appends new list of help sections', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    jest.doMock('../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('up', async () => {
    const { up } = require('../20-append-updated-help-sections');
    await context.collections.HelpSections.rawCollection().insertMany(
      times(n => ({ title: faker.random.words(), index: n }), 5),
    );

    await up();

    const query = {};
    const options = { sort: { index: 1 } };
    const helpSections = await context.collections.HelpSections.find(query, options).fetch();

    await expect(helpSections).toHaveLength(15);
    helpSections.forEach((helpSection, n) => expect(helpSection).toEqual({
      _id: expect.anything(),
      title: expect.any(String),
      index: n,
    }));
  });

  test('down', async () => {
    const { up, down } = require('../20-append-updated-help-sections');

    await up();

    await expect(context.collections.HelpSections.find().count()).resolves.toBe(10);

    await down();

    await expect(context.collections.HelpSections.find().count()).resolves.toBe(0);
  });
});
