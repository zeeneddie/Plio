import { Migrations } from 'meteor/percolate:migrations';

import { HelpSections } from '../../../share/collections';

const HELP_SECTIONS = [
  '1. How to get help',
  '2. Getting started',
  '3. Managing standards',
  '4. Managing risks',
  '5. Managing nonconformities and gains',
  '6. Managing workflows',
  '7. Managing key goals',
  '8. User management',
  '9. Customizing Plio',
  '10. FAQs',
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
