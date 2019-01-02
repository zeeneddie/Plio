import { Migrations } from 'meteor/percolate:migrations';

import { CanvasSettings } from '../../../share/collections';

export const up = async () => {
  const query = { notify: { $exists: false } };
  const modifier = {
    $set: {
      notify: [],
    },
  };
  const options = { multi: true, validate: false };

  return CanvasSettings.update(query, modifier, options);
};

export const down = async () => {
  const query = {};
  const modifier = { $unset: { notify: '' } };
  const options = { multi: true, validate: false };

  return CanvasSettings.update(query, modifier, options);
};

Migrations.add({
  up,
  down,
  version: 18,
  name: 'Adds notify to canvas settings',
});
