import onCreated from '../common/on-created';
import { getReceivers } from './helpers';

export default {
  logs: [
    onCreated.logs.default,
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
