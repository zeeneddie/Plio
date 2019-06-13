import { getReceivers, emailTemplateData } from '../helpers';
import color from '../../common/fields/color';

export default {
  field: 'color',
  logs: [color.logs.default],
  notifications: [color.notifications.default],
  data: color.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
