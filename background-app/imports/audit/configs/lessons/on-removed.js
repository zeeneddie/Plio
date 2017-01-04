import { getLogData } from './helpers';


export default {
  logs: [
    {
      message: 'lessons.on-removed.on-removed',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ oldDoc }) {
    const auditConfig = this;

    return {
      docName: () => auditConfig.docName(oldDoc),
      title: () => oldDoc.title,
    };
  },
};
