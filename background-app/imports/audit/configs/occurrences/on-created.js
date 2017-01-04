import { getLogData } from './helpers';
import { getPrettyOrgDate } from '../../utils/helpers';


export default {
  logs: [
    {
      message: 'occurrences.on-created.on-created',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docName: () => auditConfig.docName(newDoc),
      date: () => getPrettyOrgDate(newDoc.date, orgId()),
    };
  },
};
