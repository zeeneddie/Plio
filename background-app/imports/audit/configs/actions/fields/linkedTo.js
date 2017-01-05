import { ProblemTypes } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getLinkedDocAuditConfig } from '../../../utils/helpers.js';
import { getLinkedDocDescription, getLinkedDocName, getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';
import NCWorkflow from '/imports/workflow/NCWorkflow.js';
import RiskWorkflow from '/imports/workflow/RiskWorkflow.js';


export default {
  field: 'linkedTo',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{{linkedDocDesc}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{{linkedDocDesc}}}'
      }
    },
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{{docName}}} was linked to this document',
        [ChangesKinds.ITEM_REMOVED]: '{{{docName}}} was unlinked from this document'
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
          documentId
        };
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} linked {{{docDesc}}} {{{docName}}} to {{{linkedDocDesc}}} {{{linkedDocName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} {{{docName}}} from {{{linkedDocDesc}}} {{{linkedDocName}}}'
      }
    }
  ],
  data({ diffs: { linkedTo }, newDoc, user }) {
    const { item: { documentId, documentType } } = linkedTo;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      linkedDocDesc: () => getLinkedDocDescription(documentId, documentType),
      linkedDocName: () => getLinkedDocName(documentId, documentType),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
    const doc = (linkedTo.kind === ChangesKinds.ITEM_ADDED) ? newDoc : oldDoc;
    return getReceivers(doc, user);
  },
  triggers: [
    function({ diffs: { linkedTo }, newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();

      if (linkedTo.kind === ChangesKinds.ITEM_REMOVED) {
        const { documentId, documentType } = linkedTo.item;

        const workflowConstructor = {
          [ProblemTypes.NON_CONFORMITY]: NCWorkflow,
          [ProblemTypes.RISK]: RiskWorkflow
        }[documentType];

        new workflowConstructor(documentId).refreshStatus();
      }
    }
  ]
};
