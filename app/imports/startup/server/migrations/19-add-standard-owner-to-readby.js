import { Migrations } from 'meteor/percolate:migrations';

import { Standards } from '../../../share/collections';

export const up = async () => {
  const query = {
    readBy: { $exists: false },
    owner: { $exists: true },
  };
  const options = {
    fields: {
      owner: 1,
    },
  };

  await Promise.all(await Standards.find(query, options).map(({ _id, owner }) => {
    const modifier = {
      $set: {
        readBy: [owner],
      },
    };
    return Standards.update({ _id }, modifier);
  }));
};

export const down = async () => {
  const query = {
    readBy: {
      $exists: true,
    },
  };
  const modifier = {
    $unset: {
      readBy: '',
    },
  };
  const options = {
    multi: true,
    validate: false,
  };
  Standards.update(query, modifier, options);
};

Migrations.add({
  up,
  down,
  version: 19,
  name: 'Adds standard owner to readBy',
});
