import { getLogData } from './helpers.js';
import { getPrettyOrgDate } from '../../utils/helpers.js';


export default {
  logs: [
    {
      message: 'occurrences.on-removed.on-removed',
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
