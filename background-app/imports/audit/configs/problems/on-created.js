import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { getUserId } from '../../utils/helpers';
import StandardAuditConfig from '../standards/standard-audit-config';
import onCreated from '../common/on-created';
import ownerIdField from '../common/fields/ownerId';

export default {
  logs: [
    onCreated.logs.default,
    {
      message: '{{{docName}}} was linked to this document',
      data({ newDoc, auditConfig }) {
        return _(newDoc.standardsIds.length).times(() => ({
          docName: auditConfig.docName(newDoc),
        }));
      },
      logData({ newDoc: { standardsIds } }) {
        return _(standardsIds).map(standardId => ({
          collection: StandardAuditConfig.collectionName,
          documentId: standardId,
        }));
      },
    },
  ],
  notifications: [
    {
      text: '{{{userName}}} created {{{docDesc}}} {{{docName}}} for {{{standardDesc}}} {{{standardName}}}',
      data({ newDoc }) {
        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map(standard => ({
          standardDesc: StandardAuditConfig.docDescription(standard),
          standardName: StandardAuditConfig.docName(standard),
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
    {
      text: ownerIdField.notifications.personal.text,
      title: ownerIdField.notifications.personal.title,
      emailTemplateData: ownerIdField.notifications.personal.emailTemplateData,
      sendBoth: true,
      receivers({ newDoc, user }) {
        const userId = getUserId(user);
        const { ownerId } = newDoc || {};

        return (ownerId && (userId !== ownerId)) ? [ownerId] : [];
      },
    },
  ],
  trigger({ newDoc: { _id }, auditConfig }) {
    new auditConfig.workflowConstructor(_id).refreshStatus();
  },
};
