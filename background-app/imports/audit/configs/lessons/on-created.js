import { getLogData } from './helpers.js';


export default {
  logs: [
    {
      message: '{{docDesc}} added: "{{title}}"',
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      title: () => newDoc.title
    };
  }
};
