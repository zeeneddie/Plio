import { getReceivers, emailTemplateData } from '../helpers';
import notes from '../../common/fields/notes';

export default {
  field: 'notes',
  logs: [notes.logs.default],
  notifications: [notes.notifications.default],
  data: notes.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
