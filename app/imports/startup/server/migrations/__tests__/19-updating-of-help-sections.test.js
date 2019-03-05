import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { find, propEq } from 'ramda';

import createContext from '../../../../share/utils/tests/createContext';

export const OldHelpSections = [
  {
    index: 1,
    title: 'How to get help',
  },
  {
    index: 2,
    title: 'Getting started',
  },
  {
    index: 3,
    title: 'Creating your Standards manual',
  },
  {
    index: 4,
    title: 'Managing risks',
  },
  {
    index: 5,
    title: 'Managing nonconformities',
  },
  {
    index: 6,
    title: 'Managing workflows',
  },
  {
    index: 7,
    title: 'User management',
  },
  {
    index: 8,
    title: 'FAQs',
  },
];

export const HelpSections = [
  {
    index: 1,
    title: 'How to get help',
  },
  {
    index: 2,
    title: 'Getting started',
  },
  {
    index: 3,
    title: 'Creating your Standards manual',
  },
  {
    index: 4,
    title: 'Creating your business model canvas',
  },
  {
    index: 5,
    title: 'Managing nonconformities & gains',
  },
  {
    index: 6,
    title: 'Managing risks',
  },
  {
    index: 7,
    title: 'Managing training',
  },
  {
    index: 8,
    title: 'Managing key goals',
  },
  {
    index: 9,
    title: 'Managing workflows',
  },
  {
    index: 10,
    title: 'User management',
  },
  {
    index: 11,
    title: 'Customizing Plio',
  },
  {
    index: 12,
    title: 'FAQs',
  },
];

describe('Migration: updates help sections', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    jest.doMock('../../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  test('up', async () => {
    const { up } = require('../19-updating-of-help-sections');

    await context.collections.HelpSections.rawCollection().insertMany(OldHelpSections);

    await up();

    const helpSections = await context.collections.HelpSections.find().fetch();

    expect(helpSections).toHaveLength(12);
    helpSections.forEach(({ index, title }) => {
      const section = find(propEq('index', index), HelpSections);
      expect(section).toEqual(expect.anything());
      expect(title).toEqual(section.title);
    });
  });

  test('down', async () => {
    const { down } = require('../19-updating-of-help-sections');

    await context.collections.HelpSections.rawCollection().insertMany(HelpSections);

    await down();

    const helpSections = await context.collections.HelpSections.find().fetch();

    expect(helpSections).toHaveLength(8);
    helpSections.forEach(({ index, title }) => {
      const section = find(propEq('index', index), OldHelpSections);
      expect(section).toEqual(expect.anything());
      expect(title).toEqual(section.title);
    });
  });
});
