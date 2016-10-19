import { getLogData } from './helpers.js';


export default {
  logs: [
    {
      message: '{{docDesc}} removed: "{{title}}"',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ oldDoc }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(oldDoc),
      title: () => oldDoc.title
    };
  }
};
