const ProblemGuidelineTypes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemMagnitudes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemsStatuses = {
  1: 'Open - just reported',
  2: 'Open - just reported, awaiting analysis',
  3: 'Open - just reported, awaiting action',
  4: 'Open - analysis due today',
  5: 'Open - analysis overdue',
  6: 'Open - analysis completed, action needed',
  7: 'Open - analysis completed, action(s) in place',
  8: 'Open - action(s) due today',
  9: 'Open - action(s) overdue',
  10: 'Open - action(s) completed',
  11: 'Open - action(s) completed, awaiting verification',
  12: 'Open - verification due today',
  13: 'Open - verification past due',
  14: 'Open - action(s) verified as effective, awaiting update of standard(s)',
  15: 'Open - action(s) verified as effective, update of standard(s) due today',
  16: 'Open - action(s) verified as effective, update of standard(s) past due',
  17: 'Open - action(s) failed verification',
  18: 'Closed - action(s) completed',
  19: 'Closed - action(s) verified, standard(s) reviewed',
  20: 'Deleted'
};

const StandardStatuses = {
  'issued': 'Issued',
  'draft': 'Draft'
};

const AnalysisStatuses = {
  0: 'Not completed',
  1: 'Completed'
};

const ReviewStatuses = {
  0: 'Overdue',
  1: 'Awaiting review',
  2: 'Up-to-date'
};

const ProblemTypes = {
  NC: 'non-conformity',
  RISK: 'risk'
};

const DocumentTitles = {
  STANDARD: 'Standard',
  NC: 'Non-conformity',
  RISK: 'Risk'
}

const ActionTypes = {
  CORRECTIVE_ACTION: 'CA',
  PREVENTATIVE_ACTION: 'PA',
  RISK_CONTROL: 'RC'
};

const WorkItemsStore = {
  TYPES: {
    COMPLETE_ACTION: 'complete action',
    VERIFY_ACTION: 'verify action',
    COMPLETE_ANALYSIS: 'complete analysis',
    COMPLETE_UPDATE_OF_STANDARDS: 'complete update of standards'
  },
  LINKED_TYPES: {
    ...ActionTypes,
    ...ProblemTypes
  },
  STATUSES: {
    0: 'in progress',
    1: 'due today',
    2: 'overdue',
    3: 'completed'
  }
};

const ActionUndoTimeInHours = 1;

const ActionStatuses = {
  1: 'In progress',
  2: 'In progress - due for completion today',
  3: 'In progress - completion overdue',
  4: 'In progress - completed, not yet verified',
  5: 'In progress - completed, verification due today',
  6: 'In progress - completed, verification overdue',
  7: 'Completed - failed verification',
  8: 'Completed - verified as effective',
  9: 'Completed',
  10: 'Deleted'
};

const ActionPlanOptions = {
  YES: 'Yes',
  NO: 'No',
  NOT_NEEDED: 'Not needed'
};

const TimeUnits = {
  DAYS: 'days',
  WEEKS: 'weeks'
};

const OrgCurrencies = {
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD'
};

const WorkflowTypes = {
  THREE_STEP: '3-step',
  SIX_STEP: '6-step'
};

const UserMembership = {
  ORG_OWNER: 'owner',
  ORG_MEMBER: 'member'
};

const UserRoles = {
  CREATE_UPDATE_DELETE_STANDARDS: 'create-update-delete-standards',
  VIEW_TEAM_ACTIONS: 'view-team-actions',
  INVITE_USERS: 'invite-users',
  DELETE_USERS: 'delete-users',
  EDIT_USER_ROLES: 'edit-user-roles',
  CHANGE_ORG_SETTINGS: 'change-org-settings'
};

const UserRolesNames = {
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Create & edit standards documents',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'View all Team actions',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.EDIT_USER_ROLES]: 'Edit user superpowers',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings'
};

const OrgOwnerRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.INVITE_USERS,
  UserRoles.DELETE_USERS,
  UserRoles.EDIT_USER_ROLES,
  UserRoles.CHANGE_ORG_SETTINGS
];

const OrgMemberRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS
];

const PhoneTypes = {
  WORK: 'Work',
  HOME: 'Home',
  MOBILE: 'Mobile'
};

const getDefaultGuideline = (type, problemType) => (
  `Please go to Organization Settings to define what a ${type} ${problemType} means in your organization.`);

const defaultRiskScoringGuideline = 'Please go to Organization settings and provide a brief summary of how Risks should be scored in your organization.';

const OrganizationDefaults = {
  workflowDefaults: {
    minorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      }
    },
    majorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    criticalProblem: {
      workflowType: WorkflowTypes.SIX_STEP,
      stepTime: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      }
    }
  },
  reminders: {
    minorNc: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      interval : {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    majorNc: {
      start: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 4,
        timeUnit: TimeUnits.DAYS
      }
    },
    criticalNc: {
      start: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 6,
        timeUnit: TimeUnits.DAYS
      }
    },
    improvementPlan: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    }
  },
  ncGuidelines: {
    minor: getDefaultGuideline(ProblemGuidelineTypes.MINOR, ProblemTypes.NC),
    major: getDefaultGuideline(ProblemGuidelineTypes.MAJOR, ProblemTypes.NC),
    critical: getDefaultGuideline(ProblemGuidelineTypes.CRITICAL, ProblemTypes.NC)
  },
  rkGuidelines: {
    minor: getDefaultGuideline(ProblemGuidelineTypes.MINOR, ProblemTypes.RISK),
    major: getDefaultGuideline(ProblemGuidelineTypes.MAJOR, ProblemTypes.RISK),
    critical: getDefaultGuideline(ProblemGuidelineTypes.CRITICAL, ProblemTypes.RISK)
  },
  rkScoringGuidelines: defaultRiskScoringGuideline
};

const DefaultStandardSections = [
  {
    title: 'Introduction'
  },
  {
    title: 'High level standards'
  },
  {
    title: 'Business standards'
  }
];

const DefaultStandardTypes = [
  {
    title: 'Process',
    abbreviation: 'PRO'
  },
  {
    title: 'Policy',
    abbreviation: 'POL'
  },
  {
    title: 'Checklist',
    abbreviation: 'CHK'
  },
  {
    title: 'Compliance management objective',
    abbreviation: 'CMO'
  },
  {
    title: 'Compliance obligation',
    abbreviation: 'COB'
  },
  {
    title: 'Standard operating procedure',
    abbreviation: 'SOP'
  },
  {
    title: 'Work instruction',
    abbreviation: 'WORK'
  },
  {
    title: 'Product specification',
    abbreviation: 'SPEC'
  },
  {
    title: 'Risk control',
    abbreviation: 'RSC'
  },
  {
    title: 'Section header'
  }
];

const StandardFilters = {
  1: 'section',
  2: 'type',
  3: 'deleted'
};

const DefaultRiskTypes = [
  {
    title: 'Credit risk'
  },
  {
    title: 'Liquidity risk'
  },
  {
    title: 'Market risk'
  },
  {
    title: 'Operational risk'
  },
  {
    title: 'Regulatory risk'
  },
  {
    title: 'Reputational risk'
  },
  {
    title: 'Infosecurity risk'
  }
];

const RiskFilters = {
  1: 'type',
  2: 'status',
  3: 'department/sector',
  4: 'deleted'
};

const NonConformityFilters = {
  1: 'magnitude',
  2: 'status',
  3: 'department',
  4: 'deleted'
};

const WorkInboxFilters = {
  1: 'my current',
  2: 'team current',
  3: 'my completed',
  4: 'team completed',
  5: 'my deleted',
  6: 'team deleted'
};

const DocumentTypes = {
  STANDARD: 'standard',
  NON_CONFORMITY: ProblemTypes.NC,
  RISK: ProblemTypes.RISK
};

const ActionDocumentTypes = {
  'ACTION': 'action',
  ...ProblemTypes
};

const AvatarPlaceholders = [
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/1.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/2.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/3.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/4.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/5.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/6.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/7.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/8.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/9.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/10.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/11.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/12.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/13.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/14.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/15.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/16.png'
];

const RiskEvaluationPriorities = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High'
};

const RiskEvaluationDecisions = {
  'tolerate': 'Tolerate',
  'treat': 'Treat',
  'transfer': 'Transfer',
  'terminate': 'Terminate'
};

const CollectionNames = {
  STANDARDS: 'Standards',
  NCS: 'NonConformities',
  RISKS: 'Risks',
  ACTIONS: 'Actions',
  LESSONS: 'LessonsLearned',
  OCCURRENCES: 'Occurrences',
  MESSAGES: 'Messages',
  ORGANIZATIONS: 'Organizations',
  WORK_ITEMS: 'WorkItems'
};

const InvitationStatuses = {
  failed: 0,
  invited: 1,
  added: 2
};

const TruncatedStringLengths = {
  c40: 40
};

const UncategorizedTypeSection = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  abbreviation: 'UNC'
};

const StandardsListProjection = {
  organizationId: 1,
  title: 1,
  typeId: 1,
  sectionId: 1,
  nestingLevel: 1,
  viewedBy: 1,
  createdAt: 1,
  owner: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

const RisksListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  identifiedAt: 1,
  typeId: 1,
  scores: 1,
  departmentsIds: 1,
  status: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

const ActionsListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  linkedTo: 1,
  type: 1,
  status: 1,
  ownerId: 1,
  isCompleted: 1,
  completionTargetDate: 1,
  toBeCompletedBy: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

const NonConformitiesListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  cost: 1,
  createdAt: 1,
  identifiedAt: 1,
  magnitude: 1,
  status: 1,
  departmentsIds: 1,
  viewedBy: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

const WorkItemsListProjection = {
  organizationId: 1,
  targetDate: 1,
  type: 1,
  status: 1,
  linkedDoc: 1,
  assigneeId: 1,
  viewedBy: 1,
  createdAt: 1,
  isCompleted: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

const AnalysisTitles = {
  rootCauseAnalysis: 'Root cause analysis',
  riskAnalysis: 'Initial risk analysis'
};

const riskScoreTypes = {
  inherent: {
    id: 'inherent',
    label: 'Inherent risk',
    adj: 'Inherent'
  },
  residual: {
    id: 'residual',
    label: 'Residual risk',
    adj: 'Residual'
  }
};

const StringLimits = {
  abbreviation: {
    min: 1,
    max: 4
  },
  title: {
    min: 1,
    max: 80
  }
};

const HelpMessages = {
  Standards: {
    standard: `A compliance standard is a document that sets standards for how you do things (policies, processes, etc) in your organization.  To add a compliance standard into Plio, just fill in the card details, and link to a source file which may be a Word document, a URL link to a web document or a video.`
  },
  NonConformities: {
    nonConformity: `A non-conformity (sometimes called an exception) is a deviation from a standard, a legal regulation or an expectation.  To add a non-conformity into Plio, give it a name and fill in the top section below.  Once you've carried out an analysis of the reasons for the non-conformity, go ahead and enter corrective actions or preventative actions to fix the problem or prevent it re-occuring in the future.`,
    costPerOccurance: `A non-conformity (sometimes called an exception) is a deviation from a standard, a legal regulation or an expectation.  To add a non-conformity into Plio, give it a name and fill in the top section below.  Once you've carried out an analysis of the reasons for the non-conformity, go ahead and enter corrective actions or preventative actions to fix the problem or prevent it re-occuring in the future.`,
    occurences: `Often, the same non-conformity can occur multiple times.  Instead of adding a new non-conformity record each time, just add another occurrence of the same non-conformity.`
  },
  Risks: {
    risk: `Risk is the effect of uncertainty on an organization's objectives.  To add a Risk record in Plio, give it a name and fill in the top section below.  Next, carry out an initial risk analysis by scoring the risk, evaluating it and creating a treatment plan. Then you can go ahead and create preventative actions to reduce either the potential impact or probability of occurence.`,
    standards: `Optionally, you can link this risk to one or more of your compliance standards.`,
    departments: `Optionally, you can link this risk to one or more of your departments or sectors.`,
    riskScoringScoreType: `Indicate whether you scoring the inherent risk (which is the level of risk that existed before you treated the risk) or the residual risk (the reduced level of risk that you are expecting after you treat the risk).`,
    riskEvaluationTreatmentDecision: `Indicate how you plan to deal with this risk; Tolerate - you are just going to live with the risk; Treat - you are going to act to reduce the risk; Transfer - you are going to pass the risk on to a 3rd party; Terminate - you are going to stop the business activity which has created this risk`,
    reviewStatus: `Risks should be reviewed at least annually. Indicate when you last reviewed this risk.`
  },
  OrganizationSettings: {
    cardEditHeader: `Organization settings is where you can customize the behaviour of the Plio system.  For example, you can customize lists (e.g.  Departments, Standards types, Risk types) and create a section structure for your compliance standards documents. You can also configure whether you want simple (3-step) or full (6-step) workflows for key Plio processes, for example the non-conformity handling process.`,
    organizationName: ``,
    organizationOwner: `The organization owner in Plio is the user who controls the administration of the Plio workspace, and is the designated person for account billing.  You can request to change the organization owner and if this request is accepted by the new owner, he or she will take over administration and billing responsibilities.`,
    timeZone: `Use this setting to set the time that Plio sends out certain notification messages.`,
    defaultCurrency: `Use this setting to set the currency that Plio uses in your organization workspace.  This will also be used as the default currency for your Plio billing.`,
    departments: `Create a list of departments or business sectors for your organization.`,
    standardTypes: `Create a list of standards types for your organization.`,
    standardSections: `Create the section structure for your compliance standards documents.`,
    workflowSteps: `Indicate whether you want Plio to use simple (3-step) or full (6-step) workflows for your non-conformity and risk-handling processes.  If you wish, you can set simpler workflows for your less critical non-conformities and risks.`,
    workflowReminders: `Set apppropriate reminder times for actions that become due within your non-conformity and risk-handling processes.   If you wish, you can set shorter reminder times for less critical non-conformities and risks.`,
    nonConformityGuidelines: `Help users to indicate the magnitude of this non-conformity, by giving them some clear guidelines relating to the estimated cost impact, or impact on customers.`,
    riskTypes: `Create a list of standards types for your organization.`
  }
};


const SystemName = 'Plio';

const RCAMaxCauses = 5;

const DEFAULT_POLLING_INTERVAL_FOR_COUNTER = 5000; // 5 sec

export {
  ActionTypes,
  ActionStatuses,
  ActionPlanOptions,
  ActionUndoTimeInHours,
  CollectionNames,
  DefaultStandardSections,
  DefaultStandardTypes,
  DefaultRiskTypes,
  ProblemGuidelineTypes,
  ProblemsStatuses,
  AnalysisStatuses,
  StandardStatuses,
  OrgCurrencies,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  PhoneTypes,
  StandardFilters,
  RiskFilters,
  NonConformityFilters,
  ProblemMagnitudes,
  ProblemTypes,
  TimeUnits,
  UserMembership,
  UserRoles,
  UserRolesNames,
  DocumentTypes,
  AvatarPlaceholders,
  WorkInboxFilters,
  ActionDocumentTypes,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions,
  ReviewStatuses,
  WorkItemsStore,
  RKTypes,
  TruncatedStringLengths,
  WorkflowTypes,
  SystemName,
  InvitationStatuses,
  UnreadMessages,
  UncategorizedTypeSection,
  StandardsListProjection,
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection,
  WorkItemsListProjection,
  AnalysisTitles,
  riskScoreTypes,
  RCAMaxCauses,
  DEFAULT_POLLING_INTERVAL_FOR_COUNTER,
  DocumentTitles,
  StringLimits
};
