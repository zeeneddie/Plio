import { getLogData } from './helpers';


export default {
  logs: [
    {
      message: '{{{docName}}} removed: "{{{title}}}"',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ oldDoc, auditConfig }) {
    return {
      docName: auditConfig.docName(oldDoc),
      title: oldDoc.title,
    };
  },
};
