export { getNotifyReceivers as getReceivers } from '../../utils/helpers';

export function emailTemplateData({ newDoc, auditConfig }) {
  return {
    button: {
      label: 'Go to this canvas',
      url: auditConfig.docUrl(newDoc),
    },
  };
}
