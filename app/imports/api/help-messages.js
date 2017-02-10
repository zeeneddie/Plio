import { UserRoles } from '/imports/share/constants.js';

const StandardsHelp = {
  standard: `A standard is a document that sets standards for how you do things (policies, processes, etc) in your organization.  To add a standard into Plio, just fill in the card details, and link to a source file which may be a Word document, a URL link to a web document or a video.`
};

const NonConformitiesHelp = {
  nonConformity: `A non-conformity (sometimes called an exception) is a deviation from a standard, a legal regulation or an expectation.  To add a non-conformity into Plio, give it a name and fill in the top section below.  Once you've carried out an analysis of the reasons for the non-conformity, go ahead and enter corrective actions or preventative actions to fix the problem or prevent it re-occuring in the future.`,
  costPerOccurance: `Estimate the approximate cost of each occurrence of this non-conformity.`,
  occurences: `Often, the same non-conformity can occur multiple times.  Instead of adding a new non-conformity record each time, just add another occurrence of the same non-conformity.`
};

const RisksHelp = {
  risk: `Risk is the effect of uncertainty on an organization's objectives.  To add a Risk record in Plio, give it a name and fill in the top section below.  Next, carry out an initial risk analysis by scoring the risk, evaluating it and creating a treatment plan. Then you can go ahead and create preventative actions to reduce either the potential impact or probability of occurence.`,
  standards: `Optionally, you can link this risk to one or more of your standards.`,
  departments: `Optionally, you can link this risk to one or more of your departments or sectors.`,
  riskScoringScoreType: `Indicate whether you scoring the inherent risk (which is the level of risk that existed before you treated the risk) or the residual risk (the reduced level of risk that you are expecting after you treat the risk).`,
  riskEvaluationTreatmentDecision: `Indicate how you plan to deal with this risk; Tolerate - you are just going to live with the risk; Treat - you are going to act to reduce the risk; Transfer - you are going to pass the risk on to a 3rd party; Terminate - you are going to stop the business activity which has created this risk.`,
  reviewStatus: `Risks should be reviewed at least annually. Indicate when you last reviewed this risk.`
};

const WorkInboxHelp = {
  completeActionHelp: `Click on the Complete button to indicate completion of this action. Optionally you can enter any relevant completion comments.`,
  verifyActionHelp: `Click on the Verify button to indicate verification of this action. Optionally you can enter any relevant verification comments.`,
  completeAnalysisHelp: `Click on the Complete button to indicate completion of this analysis. Optionally you can enter any relevant completion comments.`,
  updateDocumentHelp: `Click on the Update button to indicate that the relevant standard(s) or risk record(s) has been updated. Optionally you can enter any relevant update comments.`
};

const OrganizationSettingsHelp = {
  organizationSettings: `Organization settings is where you can customize the behaviour of the Plio system.  For example, you can customize lists (e.g.  Departments, Standards types, Risk types) and create a section structure for your standards documents. You can also configure whether you want simple (3-step) or full (6-step) workflows for key Plio processes, for example the non-conformity handling process.`,
  organizationName: `You can choose to set up all your users within a single organization in Plio, or create different Plio organizations for different business units. Either way, you will need to give your Plio organization a name.  This is usually identical to your company name, or a shortened version of it.`,
  organizationOwner: `The organization owner in Plio is the user who controls the administration of the Plio workspace, and is the designated person for account billing.  You can request to change the organization owner and if this request is accepted by the new owner, he or she will take over administration and billing responsibilities.`,
  organizationOwnerEmail: `Hello World`,
  timeZone: `Use this setting to set the time that Plio sends out certain notification messages.`,
  defaultCurrency: `Use this setting to set the currency that Plio uses in your organization workspace.  This will also be used as the default currency for your Plio billing.`,
  departments: `Create a list of departments or business sectors for your organization.`,
  standardTypes: `Create a list of standards types for your organization.`,
  standardSections: `Create the section structure for your standards documents.`,
  workflowSteps: `Indicate whether you want Plio to use simple (3-step) or full (6-step) workflows for your non-conformity and risk-handling processes.  If you wish, you can set simpler workflows for your less critical non-conformities and risks.`,
  workflowReminders: `Set apppropriate reminder times for actions that become due within your non-conformity and risk-handling processes.   If you wish, you can set shorter reminder times for less critical non-conformities and risks.`,
  nonConformityGuidelines: `Help users to indicate the magnitude of this non-conformity, by giving them some clear guidelines relating to the estimated cost impact, or impact on customers.`,
  riskTypes: `Create a list of standards types for your organization.`,
  riskGuidelines: `Help users to indicate the magnitude of this risk more accurately, by giving them some clear guidelines (e.g by financial impact  minor - under $1,000; major $1k - $10k) in the context of your organization.`,
  riskScoringGuidelines: `Help users to score this risk more accurately, by giving them some clear guidelines on what the various scoring terms (e.g. minor, moderate, significant) mean in the context of your organization.`,
  homeScreenTitles: `Plio lets you customize the labels for each of the main icons on your home screen. Just select an icon label you wish to change, click on the selection button and select an alternative name from the options provided, or create an entirely new name`,
};

const MyPreferencesHelp = {
  myPreferences: `My preferences gives you control over your notifications of events, including your desktop notifications and your daily recap emails.`
};

const UserProfileHelp = {
  userProfile: `The user profile card lets you add your user profile picture and edit your contact details.  It's also where (if you have been given admin rights) you can give other users additional system powers and editing permissions.`,
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: `Indicate whether this user can create and edit standards documents`,
  [UserRoles.VIEW_TEAM_ACTIONS]: `Indicate whether this user can view all his team's actions in the Work inbox, or just his own actions`,
  [UserRoles.INVITE_USERS]: `Indicate whether this user can invite other users to join your Plio organization`,
  [UserRoles.DELETE_USERS]: `Indicate whether this user can delete other users from your Plio organization`,
  [UserRoles.EDIT_USER_ROLES]: `Indicate whether this user can edit the User Superpowers section in the User profile (you should only grant this power to very few, highly trusted users)`,
  [UserRoles.CHANGE_ORG_SETTINGS]: `Indicate whether this user can edit the Organization settings (you should only grant this power to very few, highly trusted users)`,
};

export {
  StandardsHelp,
  NonConformitiesHelp,
  RisksHelp,
  OrganizationSettingsHelp,
  WorkInboxHelp,
  MyPreferencesHelp,
  UserProfileHelp
};
