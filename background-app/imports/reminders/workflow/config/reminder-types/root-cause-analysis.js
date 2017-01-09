import { TimeRelations } from '../constants';
import { getDefaultData, getDocUrlByData, getUnsubscribeUrl } from '../helpers';
import { getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  title: {
    [TimeRelations.BEFORE_DUE]:
      'Root cause analysis of {{docDesc}} {{{docName}}} is {{diff}} before due',
    [TimeRelations.DUE_TODAY]:
      'Root cause analysis of {{docDesc}} {{{docName}}} is due today',
    [TimeRelations.OVERDUE]:
      'Root cause analysis of {{docDesc}} {{{docName}}} is {{diff}} overdue',
  },

  text: {
    [TimeRelations.BEFORE_DUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete a root cause analysis of {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is {{diff}} before due.',
    [TimeRelations.DUE_TODAY]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete a root cause analysis of {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is due today.',
    [TimeRelations.OVERDUE]:
      'You have been asked {{#if assignedBy}}by {{{assignedBy}}} {{/if}}' +
      'to complete a root cause analysis of {{docDesc}} ' +
      '{{{docName}}} by {{date}}. This action is {{diff}} overdue.',
  },

  data: ({ doc, ...rest }) => {
    const defaultData = getDefaultData({ doc, ...rest });

    return Object.assign(defaultData, {
      assignedBy: () => getUserFullNameOrEmail(doc.analysis.assignedBy),
    });
  },

  receivers: ({ doc: { analysis, notify } }) => (
    (analysis.executor && (notify.indexOf(analysis.executor) > -1))
      ? [analysis.executor]
      : []
  ),

  url: getDocUrlByData,

  unsubscribeUrl: getUnsubscribeUrl,
};
