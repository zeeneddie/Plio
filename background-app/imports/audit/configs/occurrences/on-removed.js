import { getLogData } from './helpers.js';
import { getPrettyOrgDate } from '../../utils/helpers.js';


export default {
  logs: [
    {
      message: '{{{docName}}} removed: date - {{date}}',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ oldDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(oldDoc);

    return {
      docName: () => auditConfig.docName(oldDoc),
      date: () => getPrettyOrgDate(oldDoc.date, orgId())
    };
  }
};
