import onRemoved from '../common/on-removed';
import { getReceivers } from './helpers';

export default {
  logs: [
    onRemoved.logs.default,
  ],
  notifications: [
    {
      text: '{{{userName}}} has removed the {{{docDesc}}} ' +
      'called {{{docName}}} to the {{{orgName}}} canvas',
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
  ],
};
