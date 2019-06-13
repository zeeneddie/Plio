import { getReceivers } from './helpers';

export default {
  logs: [
    {
      message: 'New canvas item created',
    },
  ],
  notifications: [
    {
      text: '{{{userName}}} has added a new {{{docDesc}}} ' +
      'called {{{docName}}} to the {{{orgName}}} canvas',
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
  ],
};
