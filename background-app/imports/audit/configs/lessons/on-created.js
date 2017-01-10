import { getLogData } from './helpers';


export default {
  logs: [
    {
      message: '{{{docName}}} added: "{{{title}}}"',
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ newDoc: { title } }) {
    return { title };
  },
};
