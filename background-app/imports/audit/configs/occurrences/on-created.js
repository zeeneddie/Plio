import { getLogData } from './helpers.js';
import { getPrettyOrgDate } from '../../utils/helpers.js';


export default {
  logs: [
    {
      message: '{{{docName}}} added: date - {{date}}',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docName: () => auditConfig.docName(newDoc),
      date: () => getPrettyOrgDate(newDoc.date, orgId())
    };
  }
};
