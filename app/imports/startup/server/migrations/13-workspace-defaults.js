/* eslint-disable no-console */
import { Migrations } from 'meteor/percolate:migrations';

import { Organizations } from '../../../share/collections';
import { WORKSPACE_DEFAULTS, WorkspaceDefaults } from '../../../share/constants';

Migrations.add({
  version: 13,
  name: 'Add workspace defaults to organizations',
  up() {
    const query = { [WORKSPACE_DEFAULTS]: null };
    const modifier = {
      $set: {
        [WORKSPACE_DEFAULTS]: WorkspaceDefaults,
      },
    };
    const options = { multi: true };
    Organizations.update(query, modifier, options);
    console.log('Added workspace defaults to organizations');
  },
  down() {
    const query = {};
    const modifier = {
      $unset: {
        [WORKSPACE_DEFAULTS]: '',
      },
    };
    const options = { multi: true, validate: false };
    Organizations.update(query, modifier, options);
    console.log('Removed workspace defaults from organizations');
  },
});
