import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


const getWorkflowDefaultsConfig = (field, relatedDocs) => [
  {
    field: `workflowDefaults.${field}.workflowType`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_CHANGED]:
              'Workflow type for {{{relatedDocs}}} changed ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}"',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_CHANGED]:
              '{{{userName}}} changed workflow type for {{{relatedDocs}}} ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}" in {{{docDesc}}} {{{docName}}}',
        },
      },
    ],
    data({ diffs }) {
      const { newValue, oldValue } = diffs[
        `workflowDefaults.${field}.workflowType`
      ];

      return { newValue, oldValue, relatedDocs };
    },
    rreceivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
  },

  {
    field: `workflowDefaults.${field}.stepTime.timeUnit`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_CHANGED]:
              'Default step time for {{{relatedDocs}}} changed ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}"',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_CHANGED]:
              '{{{userName}}} changed default step time for {{{relatedDocs}}} ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}" in {{{docDesc}}} {{{docName}}}',
        },
      },
    ],
    data({ diffs, newDoc }) {
      const { newValue, oldValue } = diffs[
        `workflowDefaults.${field}.stepTime.timeUnit`
      ];
      const timeVal = newDoc.workflowDefaults[field].stepTime.timeValue;

      return {
        newValue: `${timeVal} ${newValue}`,
        oldValue: `${timeVal} ${oldValue}`,
        relatedDocs,
      };
    },
    receivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
  },

  {
    field: `workflowDefaults.${field}.stepTime.timeValue`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_CHANGED]:
              'Default step time for {{{relatedDocs}}} changed ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}"',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_CHANGED]:
              '{{{userName}}} changed default step time for {{{relatedDocs}}} ' +
              'from "{{{oldValue}}}" to "{{{newValue}}}" in {{{docDesc}}} {{{docName}}}',
        },
      },
    ],
    data({ diffs, newDoc }) {
      const { newValue, oldValue } = diffs[
        `workflowDefaults.${field}.stepTime.timeValue`
      ];
      const { timeUnit } = newDoc.workflowDefaults[field].stepTime;

      return {
        newValue: `${newValue} ${timeUnit}`,
        oldValue: `${oldValue} ${timeUnit}`,
        relatedDocs,
      };
    },
    receivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
  },
];

export default [
  ...getWorkflowDefaultsConfig('minorProblem', 'minor nonconformities/risks'),
  ...getWorkflowDefaultsConfig('majorProblem', 'major nonconformities/risks'),
  ...getWorkflowDefaultsConfig('criticalProblem', 'critical nonconformities/risks'),
  {
    field: 'workflowDefaults.isActionsCompletionSimplified',
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_CHANGED]:
            'Simplified completion of own actions {{{operation}}}',
        },
      },
    ],
    notifications: [
      {
        text: '{{{userName}}} {{{operation}}} simplified completion of own actions ' +
        'in {{{docDesc}}} {{{docName}}}',
      },
    ],
    data({ diffs }) {
      const { newValue, oldValue } = diffs[
        'workflowDefaults.isActionsCompletionSimplified'
      ];
      const operation = newValue ? 'enabled' : 'disabled';

      return {
        newValue,
        oldValue,
        operation,
      };
    },
    receivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
  },
];
