import { getLogData } from './helpers';
import { getPrettyOrgDate } from '../../utils/helpers';


export default {
  logs: [
    {
      message: 'occurrences.on-removed.on-removed',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ oldDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(oldDoc);

    return {
      docName: () => auditConfig.docName(oldDoc),
      date: () => getPrettyOrgDate(oldDoc.date, orgId()),
    };
  },
};
