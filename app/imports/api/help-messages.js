/* eslint-disable max-len */

import { UserRoles } from '../share/constants';

const StandardsHelp = {
  standard: 'A Standard is a document that explains the agreed way or best way to carry out a key activity (e.g a process, task or policy) in your organization. To add a Standard into Plio, just fill in the card details, and link to a source file. This can be either a Word document, a URL link to a web document or a video.',
  uniqueNumber: 'Uniquely identify your Standard with a number between 1 and 10000.',
};

const NonConformitiesHelp = {
  nonConformity: 'A Nonconformity (sometimes called an exception) is a deviation from a Standard. It can also be a deviation from an unstated expectation of how things should be done, or a breach of a legal regulation. To add a Nonconformity into Plio, give it a name and fill in the top section below. Once you\'ve carried out an analysis of the reasons for the Nonconformity, go ahead and enter corrective or preventative actions to fix the problem or prevent it reoccurring in the future.',
  costPerOccurance: 'Estimate the approximate cost of each occurrence of this Nonconformity.',
  occurences: 'Often, the same Nonconformity can occur multiple times.  Instead of adding a new Nonconformity record each time, just add another occurrence of the same Nonconformity.',
};

const PotentialGainsHelp = {
  potentialGain: 'A Potential Gain is essentially the opposite of a Nonconformity. In Plio it is defined as an opportunity for an improvement in a task or process (contrast this with a Nonconformity which is a deviation from a documented Standard or from a specification - in other words, an identified problem in a process, task or policy).',
  costPerOccurance: 'Estimate the approximate financial benefit that will be achieved through implementing this Potential Gain.',
};

const RisksHelp = {
  risk: 'Risk is the effect of uncertainty on an organization\'s objectives. To add a Risk record in Plio, give it a name and fill in the top section below. Next, carry out an initial risk analysis by scoring the Risk, evaluating it and creating a treatment plan. Then you can go ahead and create corrective or preventative actions to reduce the potential impact or the probability of occurence of this Risk.',
  standards: 'Optionally, you can link this Risk to one or more of your Standards.',
  departments: 'Optionally, you can link this Risk to one or more of your departments or sectors.',
  riskScoringScoreType: 'Indicate whether you scoring the inherent risk (which is the level of risk that existed before you treated the risk) or the residual risk (the reduced level of risk that you are expecting after you treat the risk).',
  riskEvaluationTreatmentDecision: 'Indicate how you plan to deal with this Risk; Tolerate - you are just going to live with the risk; Treat - you are going to act to reduce the risk; Transfer - you are going to pass the risk on to a 3rd party; Terminate - you are going to stop the business activity which has created this Risk.',
  reviewStatus: 'Risks should be reviewed at least annually. Indicate when you last reviewed this Risk.',
};

const WorkInboxHelp = {
  completeActionHelp: 'Click on the Complete button to indicate completion of this action. Optionally you can enter any relevant completion comments.',
  verifyActionHelp: 'Click on the Verify button to indicate verification of this action. Optionally you can enter any relevant verification comments.',
  completeAnalysisHelp: 'Click on the Complete button to indicate completion of this analysis. Optionally you can enter any relevant completion comments.',
  updateDocumentHelp: 'Give your approval that this open work item (see below) can now be closed.',
};

const OrganizationSettingsHelp = {
  organizationSettings: 'Organization settings is where you can customize the behaviour of the Plio system. For example, you can customize lists (e.g. Departments, Standards types, Risk types) and create a section structure for your Standards documents. You can also configure whether you want to use simple (3-step) or full (6-step) workflows for dealing with different levels of Nonconformities and Risks.',
  organizationName: 'You can choose to set up all your users within a single organization in Plio, or create different Plio organizations for different business units. Either way, you will need to give your Plio organization a name.  This is usually identical to your company name, or a shortened version of it.',
  organizationOwner: 'The organization owner in Plio is the user who controls the administration of the Plio workspace, and is the designated person for account billing.  You can request to change the organization owner and if this request is accepted by the new owner, he or she will take over administration and billing responsibilities.',
  timeZone: 'Use this setting to set the time that Plio sends out certain notification messages.',
  defaultCurrency: 'Use this setting to set the currency that Plio uses in your organization workspace.  This will also be used as the default currency for your Plio billing.',
  departments: 'Create a list of departments or teams for your organization.',
  projects: 'Create a list of projects for your organization.',
  standardTypes: 'Create a list of Standards types for your organization.',
  standardSections: 'Create a customised section structure to make it easier for your users to browse and navigate through your collection of Standards documents.',
  workflowSteps: 'Indicate whether you want Plio to use simple (3-step) or full (6-step) workflows for your Nonconformity and Risk-handling processes. To save time and effort, you can set simpler workflows for your less critical Nonconformities and Risks. Plio always uses a 3-step workflow process for managing Potential Gains. Workflows can be further simplified by ticking the “Simplified completion of own actions” box. When this box is ticked, if an owner of a Nonconformity (or Potential Gain) has created an action for themselves and then clicked the complete button for that action, it won’t be returned to that same person to verify completion. If you do need specific recording of each and every verification step in Plio, then untick this box.',
  workflowReminders: 'Set appropriate reminder times for actions that become due within your Nonconformity and Risk-handling processes. If you wish, you can set shorter reminder times for less critical Nonconformities and Risks.',
  nonConformityGuidelines: 'Help users to indicate the magnitude of this Nonconformity, by giving them some clear guidelines relating to the estimated cost impact or impact on customers.',
  potentialGainGuidelines: 'Help users to indicate the magnitude of this Potential Gain, by giving them some clear guidelines relating to the estimated benefits to be gained.',
  riskTypes: 'Create a list of Risk types for your organization.',
  riskGuidelines: 'Help users to categorize the Risk magnitude more accurately by giving them some clear guidelines on what these terms mean in the context of your organization (e.g. quantify the ranges of potential cost impact or impact on customers)',
  riskScoringGuidelines: 'Help users to score this Risk more accurately by giving them a brief summary on what the various scoring terms (e.g. minor impact, moderate impact, significant impact) mean in the context of your organization (e.g. quantify the ranges of potential cost impact or impact on customers).',
  homeScreenTitles: 'You can change the default screen view that first appears when you log in to Plio, between the Operations view and the Canvas view.\n\nIn the Operations view screen, Plio lets you set different default values for numbers of items to be displayed. Whenever these default values are exceeded, Plio will display a "More” button next to each item list. Plio also lets you customize the labels for each of the main icons on your home screen. In the "Operations view - titles” section, just select an icon label you wish to change, then click on the selection button and select an alternative name or create an entirely new name.',
};

const MyPreferencesHelp = {
  myPreferences: 'My preferences gives you control over your notifications of events, including your desktop notifications and your daily recap emails.',
};

const UserProfileHelp = {
  userProfile: 'The user profile card lets you add your user profile picture and edit your contact details.  It\'s also where (if you have been given admin rights) you can give other users additional system powers and editing permissions.',
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Indicate whether this user can create and edit standards documents',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'Indicate whether this user can view all his team\'s actions in the Work inbox, or just his own actions',
  [UserRoles.INVITE_USERS]: 'Indicate whether this user can invite other users to join your Plio organization',
  [UserRoles.DELETE_USERS]: 'Indicate whether this user can delete other users from your Plio organization',
  [UserRoles.EDIT_USER_ROLES]: 'Indicate whether this user can edit the User Superpowers section in the User profile (you should only grant this power to very few, highly trusted users)',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Indicate whether this user can edit the Organization settings (you should only grant this power to very few, highly trusted users)',
  [UserRoles.COMPLETE_ANY_ACTION]: 'Indicate whether this user can complete/verify any action in your Plio organization',
  [UserRoles.CREATE_DELETE_GOALS]: 'Indicate whether this user can create and delete key goals',
};

const GoalsHelp = {
  goal: 'In Plio, key goals are defined as your important operational objectives. These can include both shorter and longer term objectives. Key goals should have an owner, plus a target date for completion, with optional milestones and one or more linked actions. Normally, it’s useful to focus on managing a relatively small number of key goals at a time, typically in the range of 5 to 20.',
};

export {
  StandardsHelp,
  NonConformitiesHelp,
  RisksHelp,
  OrganizationSettingsHelp,
  WorkInboxHelp,
  MyPreferencesHelp,
  UserProfileHelp,
  PotentialGainsHelp,
  GoalsHelp,
};
