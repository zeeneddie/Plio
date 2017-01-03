import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


const getWorkflowDefaultsConfig = (field, relatedDocs) => {
  return [
    {
      field: `workflowDefaults.${field}.workflowType`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.workflowType.changed',
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.workflowType.text.changed',
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.workflowType`
        ];
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue,
          relatedDocs,
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeUnit`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.stepTime.changed',
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.stepTime.text.changed',
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeUnit`
        ];
        const timeVal = newDoc.workflowDefaults[field].stepTime.timeValue;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${timeVal} ${newValue}`,
          oldValue: () => `${timeVal} ${oldValue}`,
          relatedDocs,
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeValue`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.stepTime.changed',
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              'organizations.fields.workflowDefaults.stepTime.text.changed',
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeValue`
        ];
        const timeUnit = newDoc.workflowDefaults[field].stepTime.timeUnit;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${newValue} ${timeUnit}`,
          oldValue: () => `${oldValue} ${timeUnit}`,
          relatedDocs,
        };
      },
      receivers: getReceivers
    },
  ];
};

export default [
  ...getWorkflowDefaultsConfig('minorProblem', 'minor non-conformities/risks'),
  ...getWorkflowDefaultsConfig('majorProblem', 'major non-conformities/risks'),
  ...getWorkflowDefaultsConfig('criticalProblem', 'critical non-conformities/risks')
];
