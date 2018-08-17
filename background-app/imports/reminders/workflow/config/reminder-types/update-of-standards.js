import { TimeRelations } from '../constants';
import { getDefaultData, getDocUrlByData, getUnsubscribeUrl } from '../helpers';
import { getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  title: {
    [TimeRelations.BEFORE_DUE]:
      'Approval related to {{docDesc}} {{{docName}}} is {{diff}} before due',
    [TimeRelations.DUE_TODAY]:
      'Approval related to {{docDesc}} {{{docName}}} is due today',
    [TimeRelations.OVERDUE]:
      'Approval related to {{docDesc}} {{{docName}}} is {{diff}} overdue',
  },

  text: {
    [TimeRelations.BEFORE_DUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete an approval related to {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is {{diff}} before due.',
    [TimeRelations.DUE_TODAY]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete an approval related to {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is due today.',
    [TimeRelations.OVERDUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete an approval related to {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is {{diff}} overdue.',
  },

  data: ({ doc, ...rest }) => {
    const defaultData = getDefaultData({ doc, ...rest });

    return Object.assign(defaultData, {
      assignedBy: () => getUserFullNameOrEmail(doc.updateOfStandards.assignedBy),
    });
  },

  receivers: ({ doc: { updateOfStandards, notify } }) => (
    (updateOfStandards.executor && (notify.indexOf(updateOfStandards.executor) > -1))
      ? [updateOfStandards.executor]
      : []
  ),

  url: getDocUrlByData,

  unsubscribeUrl: getUnsubscribeUrl,
};
