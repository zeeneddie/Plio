import { Migrations } from 'meteor/percolate:migrations';

import { Organizations } from '../../../share/collections';

export const up = () => {
  const query = { 'workflowDefaults.isActionsCompletionSimplified': null };
  const modifier = {
    $set: {
      'workflowDefaults.isActionsCompletionSimplified': true,
    },
  };
  const options = { multi: true };

  Organizations.update(query, modifier, options);

  console.log('Enabled simplified completion of own actions for all organizations');
};

export const down = () => {
  const query = {};
  const modifier = {
    $unset: {
      'workflowDefaults.isActionsCompletionSimplified': '',
    },
  };
  const options = { multi: true };

  Organizations.update(query, modifier, options);

  console.log('Disabled simplified completion of own actions for all organizations');
};

Migrations.add({
  up,
  down,
  version: 15,
  name: 'Enables simplified completion of own actions for all organizations',
});
