import { ProblemTypes } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getLinkedDocAuditConfig } from '../../../utils/helpers';
import { getLinkedDocDescription, getLinkedDocName, getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';
import NCWorkflow from '/imports/workflow/NCWorkflow';
import RiskWorkflow from '/imports/workflow/RiskWorkflow';


export default {
  field: 'linkedTo',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'actions.fields.linkedTo.doc-log.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'actions.fields.linkedTo.doc-log.item-removed',
      },
    },
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'actions.fields.linkedTo.linked-doc-log.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'actions.fields.linkedTo.linked-doc-log.item-removed',
      },
      data({ newDoc }) {
        const auditConfig = this;

        return { docName: () => auditConfig.docName(newDoc) };
      },
      logData({ diffs: { linkedTo } }) {
        const { item: { documentId, documentType } } = linkedTo;
        const auditConfig = getLinkedDocAuditConfig(documentType);

        return {
          collection: auditConfig.collectionName,
          documentId,
        };
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]: 'actions.fields.linkedTo.text.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'actions.fields.linkedTo.text.item-removed',
      },
    },
  ],
  data({ diffs: { linkedTo }, newDoc, user }) {
    const { item: { documentId, documentType } } = linkedTo;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      linkedDocDesc: () => getLinkedDocDescription(documentId, documentType),
      linkedDocName: () => getLinkedDocName(documentId, documentType),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
    const doc = (linkedTo.kind === ChangesKinds.ITEM_ADDED) ? newDoc : oldDoc;
    return getReceivers(doc, user);
  },
  triggers: [
    function ({ diffs: { linkedTo }, newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();

      if (linkedTo.kind === ChangesKinds.ITEM_REMOVED) {
        const { documentId, documentType } = linkedTo.item;

        const workflowConstructor = {
          [ProblemTypes.NON_CONFORMITY]: NCWorkflow,
          [ProblemTypes.RISK]: RiskWorkflow,
        }[documentType];

        new workflowConstructor(documentId).refreshStatus();
      }
    },
  ],
};
