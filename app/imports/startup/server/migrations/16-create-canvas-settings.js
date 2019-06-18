import { Migrations } from 'meteor/percolate:migrations';

import { Organizations, CanvasSettings } from '../../../share/collections';

export const up = () => {
  CanvasSettings.remove();
  const organization = Organizations.find().fetch();

  organization.forEach(({ _id }) =>
    CanvasSettings.insert({ organizationId: _id }, { validate: false }));

  console.log('Created canvas settings for all organizations');
};

export const down = () => {
  CanvasSettings.remove();

  console.log('Removed canvas settings for all organizations');
};

Migrations.add({
  up,
  down,
  version: 16,
  name: 'Creates canvas settings for all organizations',
});
