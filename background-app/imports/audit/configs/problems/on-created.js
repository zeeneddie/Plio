import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers';
import StandardAuditConfig from '../standards/standard-audit-config';


export default {
  logs: [
    {
      message: 'common.on-created.on-created',
    },
    {
      message: 'problems.on-created.linked-standard-log',
      data({ newDoc }) {
        return _(newDoc.standardsIds.length).times(() => ({
          docName: this.docName(newDoc),
        }));
      },
      logData({ newDoc: { standardsIds } }) {
        return _(standardsIds).map((standardId) => ({
          collection: StandardAuditConfig.collectionName,
          documentId: standardId,
        }));
      },
    },
  ],
  notifications: [
    {
      text: 'problems.on-created.linked-standard-notification.text',
      data({ newDoc, user }) {
        const auditConfig = this;
        const docDesc = auditConfig.docDescription(newDoc);
        const docName = auditConfig.docName(newDoc);
        const userName = getUserFullNameOrEmail(user);

        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map((standard) => ({
          standardDesc: StandardAuditConfig.docDescription(standard),
          standardName: StandardAuditConfig.docName(standard),
          docDesc,
          docName,
          userName,
        }));
      },
      receivers({ newDoc, user }) {
        const userId = getUserId(user);
        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map(({ owner }) => (
          (owner !== userId) ? [owner] : []
        ));
      },
    },
  ],
  triggers: [
    function ({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    },
  ],
};
