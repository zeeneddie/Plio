import { TimeRelations } from '../constants';
import { getDefaultData, getDocUrlByData, getUnsubscribeUrl } from '../helpers';


export default {
  title: {
    [TimeRelations.BEFORE_DUE]:
      'Improvement plan review is {{diff}} before due',
    [TimeRelations.DUE_TODAY]:
      'Improvement plan review is due today',
    [TimeRelations.OVERDUE]:
      'Improvement plan review is {{diff}} overdue',
  },

  text: {
    [TimeRelations.BEFORE_DUE]:
      'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
      'by {{date}}. This action is {{diff}} before due.',
    [TimeRelations.DUE_TODAY]:
      'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
      'by {{date}}. This action is due today.',
    [TimeRelations.OVERDUE]:
      'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
      'by {{date}}. This action is {{diff}} overdue.',
  },

  data: args => getDefaultData(args),

  receivers: ({ doc: { improvementPlan, notify } }) => (
    (improvementPlan.owner && (notify.indexOf(improvementPlan.owner) > -1))
      ? [improvementPlan.owner]
      : []
  ),

  url: getDocUrlByData,

  unsubscribeUrl: getUnsubscribeUrl,
};
