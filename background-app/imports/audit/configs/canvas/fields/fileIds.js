import { getReceivers, emailTemplateData } from '../helpers';
import fileIds from '../../common/fields/fileIds';

export default {
  field: 'fileIds',
  logs: [
    fileIds.logs.default,
  ],
  notifications: [
    fileIds.notifications.default,
  ],
  data: fileIds.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
