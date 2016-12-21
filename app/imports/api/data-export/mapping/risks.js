const GENERAL_SECTION = 'General';
const EVALUATION_SECTION = 'Evaluation';
const TREATMENT_PLAN_SECTION = 'Treatment Plan';
const SCORING_PLAN_SECTION = 'Scoring Plan';

export const Sections = [
  GENERAL_SECTION,
  EVALUATION_SECTION,
  TREATMENT_PLAN_SECTION,
  SCORING_PLAN_SECTION,
];

export const riskMapping = {
  riskId: {
    section: GENERAL_SECTION,
    label: 'Risk ID',
    required: true,
  },
  title: {
    section: GENERAL_SECTION,
    label: 'Title',
    required: true,
  },
  description: {
    section: GENERAL_SECTION,
    label: 'Description',
  },
  status: {
    section: GENERAL_SECTION,
    label: 'Status',
  },
  statusComment: {
    section: GENERAL_SECTION,
    label: 'Status comment',
  },
  standard: {
    section: GENERAL_SECTION,
    label: 'Standard',
  },
  department: {
    section: GENERAL_SECTION,
    label: 'Department',
  },
  identifiedBy: {
    section: GENERAL_SECTION,
    label: 'Identified by',
  },
  date: {
    section: GENERAL_SECTION,
    label: 'Date',
  },
  initialCategorisation: {
    section: GENERAL_SECTION,
    label: 'Initial categorisation',
  },
  riskType: {
    section: GENERAL_SECTION,
    label: 'Risk type',
  },

  decision: {
    section: EVALUATION_SECTION,
    label: 'Decision',
  },
  treatmentPriority: {
    section: EVALUATION_SECTION,
    label: 'Treatment priority',
  },

  desiredOutcome: {
    section: TREATMENT_PLAN_SECTION,
    label: 'Desired outcome',
  },
  targetDate: {
    section: TREATMENT_PLAN_SECTION,
    label: 'Target date',
  },
  reviewDate: {
    section: TREATMENT_PLAN_SECTION,
    label: 'Review date',
  },
  owner: {
    section: TREATMENT_PLAN_SECTION,
    label: 'Owner',
  },

  score: {
    section: SCORING_PLAN_SECTION,
    label: 'Score',
  },
  category: {
    section: SCORING_PLAN_SECTION,
    label: 'Category',
  },
  type: {
    section: SCORING_PLAN_SECTION,
    label: 'Type',
  },
  scoredBy: {
    section: SCORING_PLAN_SECTION,
    label: 'Scored by',
  },
  scoringDate: {
    section: SCORING_PLAN_SECTION,
    label: 'Date',
  },
};
