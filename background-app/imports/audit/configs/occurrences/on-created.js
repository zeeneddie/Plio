import { getLogData } from './helpers';
import { getPrettyTzDate } from '/imports/helpers/date';


export default {
  logs: [
    {
      message: '{{{docName}}} added: date - {{{date}}}',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ newDoc, organization }) {
    return {
      date: () => getPrettyTzDate(newDoc.date, organization.timezone),
    };
  },
};
