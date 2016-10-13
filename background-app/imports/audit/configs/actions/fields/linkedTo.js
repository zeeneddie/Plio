import { ProblemTypes } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getLinkedDocAuditConfig } from '../../../utils/helpers.js';
import { getLinkedDocName, getReceivers } from '../helpers.js';
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
        [ChangesKinds.ITEM_ADDED]: '{{{docDesc}}} was linked to this document',
        [ChangesKinds.ITEM_REMOVED]: '{{{docDesc}}} was unlinked from this document'
      },
      data({ newDoc }) {
        const auditConfig = this;

        return { docDesc: () => auditConfig.docDescription(newDoc) };
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
          '{{userName}} linked {{{docDesc}}} to {{{linkedDocDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} from {{{linkedDocDesc}}}'
      }
    }
  ],
  data({ diffs: { linkedTo }, newDoc, user }) {
    const { item: { documentId, documentType } } = linkedTo;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      linkedDocDesc: () => getLinkedDocName(documentId, documentType),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
    const doc = (linkedTo.kind === ChangesKinds.ITEM_ADDED) ? newDoc : oldDoc;
    return getReceivers(doc, user);
  },
  triggers: [
    function({ diffs: { linkedTo }, newDoc: { _id } }) {
      if (linkedTo.kind === ChangesKinds.ITEM_REMOVED) {
        const { documentId, documentType } = linkedTo.item;

        const workflowConstructor = {
          [ProblemTypes.NON_CONFORMITY]: NCWorkflow,
          [ProblemTypes.RISK]: RiskWorkflow
        }[documentType];

        new workflowConstructor(documentId).refreshStatus();
      }

      new ActionWorkflow(_id).refreshStatus();
    }
  ]
};
