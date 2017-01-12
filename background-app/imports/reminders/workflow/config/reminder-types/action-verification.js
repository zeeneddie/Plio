import { TimeRelations } from '../constants';
import { getDefaultData, getDocUrlByData, getActionUnsubscribeUrl } from '../helpers';
import { getActionDesc } from '/imports/helpers/description';
import { capitalize, getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  title: {
    [TimeRelations.BEFORE_DUE]:
      '{{docDescCapitalized}} {{{docName}}} is {{diff}} before due',
    [TimeRelations.DUE_TODAY]:
      '{{docDescCapitalized}} {{{docName}}} is due today',
    [TimeRelations.OVERDUE]:
      '{{docDescCapitalized}} {{{docName}}} is {{diff}} overdue',
  },

  text: {
    [TimeRelations.BEFORE_DUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to verify {{docDesc}} {{{docName}}} by {{date}}. ' +
      'This action is {{diff}} before due.',
    [TimeRelations.DUE_TODAY]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to verify {{docDesc}} {{{docName}}} by {{date}}. ' +
      'This action is due today.',
    [TimeRelations.OVERDUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to verify {{docDesc}} {{{docName}}} by {{date}}. ' +
      'This action is {{diff}} overdue.',
  },

  data: ({ doc, docType, ...rest }) => {
    const defaultData = getDefaultData({ doc, docType, ...rest });

    return Object.assign(defaultData, {
      docDescCapitalized: () => capitalize(getActionDesc(docType)),
      assignedBy: () => getUserFullNameOrEmail(doc.verificationAssignedBy),
    });
  },

  receivers: ({ doc: { toBeVerifiedBy, notify } }) => (
    (toBeVerifiedBy && (notify.indexOf(toBeVerifiedBy) > -1))
      ? [toBeVerifiedBy]
      : []
  ),

  url: getDocUrlByData,

  unsubscribeUrl: getActionUnsubscribeUrl,
};
