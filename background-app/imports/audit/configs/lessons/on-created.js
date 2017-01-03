import { getLogData } from './helpers.js';


export default {
  logs: [
    {
      message: 'lessons.on-created.on-created',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;

    return {
      docName: () => auditConfig.docName(newDoc),
      title: () => newDoc.title
    };
  }
};
