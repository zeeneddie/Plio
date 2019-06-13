import { Migrations } from 'meteor/percolate:migrations';

import { HelpSections } from '../../../share/collections';

const HELP_SECTIONS = [
  '1. Getting started with Plio',
  '2. Managing standards',
  '3. Managing risks',
  '4. Managing nonconformities & gains',
  '5. Managing workflows',
  '6. Managing key goals',
  '7. Creating a business model canvas',
  '8. User management',
  '9. Configuring to fit your business',
  'FAQs',
  'How to get help',
];

export const up = async () => {
  let { index = -1 } = (await HelpSections.findOne({}, { sort: { index: -1 } }) || {});

  const promises = HELP_SECTIONS.map(async (title) => {
    index += 1;
    return HelpSections.insert({
      title,
      index,
    });
  });

  return Promise.all(promises);
};

export const down = async () => HelpSections.remove({
  title: {
    $in: HELP_SECTIONS,
  },
});

Migrations.add({
  up,
  down,
  version: 20,
  name: 'Appends new list of help sections',
});
