import { Migrations } from 'meteor/percolate:migrations';
import { pluck, find, propEq } from 'ramda';

import { HelpSections } from '../../../share/collections';

const HelpSectionUpdatesMap = [
  {
    oldIndex: 4,
    index: 6,
    oldTitle: 'Managing risks',
    title: 'Managing risks',
  },
  {
    oldIndex: 5,
    index: 5,
    oldTitle: 'Managing nonconformities',
    title: 'Managing nonconformities & gains',
  },
  {
    oldIndex: 6,
    index: 9,
    oldTitle: 'Managing workflows',
    title: 'Managing workflows',
  },
  {
    oldIndex: 7,
    index: 10,
    oldTitle: 'User management',
    title: 'User management',
  },
  {
    oldIndex: 8,
    index: 12,
    oldTitle: 'FAQs',
    title: 'FAQs',
  },
];

const NewHelpSection = [
  {
    index: 4,
    title: 'Creating your business model canvas',
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
    index: 11,
    title: 'Customizing Plio',
  },
];

export const up = async () => {
  const options = { validate: false };

  const currentSections = await HelpSections.find().fetch();

  currentSections.forEach(({ _id, index }) => {
    const section = find(propEq('oldIndex', index), HelpSectionUpdatesMap);
    if (section) {
      HelpSections.update({ _id }, {
        $set: {
          index: section.index,
          title: section.title,
        },
      }, options);
    }
  });

  NewHelpSection.forEach(section => HelpSections.insert(section));
};

export const down = async () => {
  const options = { validate: false };

  HelpSections.remove({
    index: {
      $in: pluck('index', NewHelpSection),
    },
  });

  const currentSections = await HelpSections.find().fetch();

  currentSections.forEach(({ _id, index }) => {
    const section = find(propEq('index', index), HelpSectionUpdatesMap);
    if (section) {
      HelpSections.update({ _id }, {
        $set: {
          index: section.oldIndex,
          title: section.oldTitle,
        },
      }, options);
    }
  });
};

Migrations.add({
  up,
  down,
  version: 19,
  name: 'Updates help sections',
});
