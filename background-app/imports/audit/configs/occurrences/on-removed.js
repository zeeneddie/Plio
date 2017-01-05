import { getLogData } from './helpers';
import { getPrettyOrgDate } from '../../utils/helpers';


export default {
  logs: [
    {
      message: '{{{docName}}} removed: date - {{date}}',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ oldDoc, organization, auditConfig }) {
    return {
      docName: () => auditConfig.docName(oldDoc),
      date: () => getPrettyOrgDate(oldDoc.date, organization.timezone),
    };
  },
};
