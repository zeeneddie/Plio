import { getLogData } from './helpers.js';
import { getPrettyOrgDate } from '../../utils/helpers.js';


export default {
  logs: [
    {
      message: '{{docDesc}} added: date - {{date}}',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      date: () => getPrettyOrgDate(newDoc.date, orgId())
    };
  }
};
