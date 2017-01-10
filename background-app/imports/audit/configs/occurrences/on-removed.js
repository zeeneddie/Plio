import { getLogData } from './helpers';
import { getPrettyTzDate } from '/imports/helpers/date';


export default {
  logs: [
    {
      message: '{{{docName}}} removed: date - {{{date}}}',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ oldDoc, organization, auditConfig }) {
    return {
      docName: () => auditConfig.docName(oldDoc),
      date: () => getPrettyTzDate(oldDoc.date, organization.timezone),
    };
  },
};
