import { Standards, StandardTypes } from '../../../share/collections';
import StandardAuditConfig from '../standards/standard-audit-config';
import NotificationsTempStore from '../../notifications-temp-store';
import { DEFAULT_EMAIL_TEMPLATE } from '../../../constants';

export { getNotifyReceivers as getReceivers } from '../../utils/helpers';

export const sendUpdateOfStandardsReminders = ({
  newDoc,
  organization: { name: organizationName },
  auditConfig,
}) => {
  const notifications = [];
  const { sequentialId, standardsIds = [] } = newDoc;

  standardsIds.forEach((standardId) => {
    const standard = Standards.findOne({ _id: standardId });
    const {
      typeId,
      title: standardTitle,
      uniqueNumber = '',
    } = standard;
    const ownerId = StandardAuditConfig.docOwner(standard);
    const notify = StandardAuditConfig.docNotifyList(standard);

    if (!notify.includes(ownerId)) return;

    const url = StandardAuditConfig.docUrl(standard);
    const unsubscribeUrl = StandardAuditConfig.docUnsubscribeUrl(standard);
    const docDesc = auditConfig.docDescription(newDoc);
    const { abbreviation } = StandardTypes.findOne({ _id: typeId });
    const standardName = `${abbreviation}${uniqueNumber} ${standardTitle}`;
    const title = `Please update ${standardName}`;
    const text = `You are the Owner of standard ${standardName},` +
      ` linked to ${docDesc} ${sequentialId}.` +
      ` Actions related to this ${docDesc} have now been completed` +
      ` and ${sequentialId} has now been closed.` +
      ' Please take this opportunity to update the standard.';

    const notification = {
      templateName: DEFAULT_EMAIL_TEMPLATE,
      recipients: [ownerId],
      emailSubject: title,
      templateData: {
        organizationName,
        title,
        text,
        docName: standardName,
        unsubscribeUrl,
        button: {
          label: 'Go to this standard',
          url,
        },
      },
      notificationData: {
        title,
        url,
        body: text,
      },
      sendBoth: true,
    };

    notifications.push(notification);
  });

  NotificationsTempStore.addNotifications(notifications);
};
