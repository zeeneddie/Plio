import { Migrations } from 'meteor/percolate:migrations';

import { HelpSections } from '../../../share/collections';

const title = '9. Configuring to fit your business';
const newTitle = '9. Configuring to fit your organization';

export const up = async () => {
  const query = { title };
  const modifier = {
    $set: {
      title: newTitle,
    },
  };
  return HelpSections.update(query, modifier);
};

export const down = async () => {
  const query = { title: newTitle };
  const modifier = {
    $set: {
      title,
    },
  };
  return HelpSections.update(query, modifier);
};

Migrations.add({
  up,
  down,
  version: 21,
  name: 'Renames "Configuring to fit your business" help section',
});
