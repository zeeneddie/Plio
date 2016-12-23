import { CollectionNames } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';

const GENERAL_SECTION = 'General';
const EVALUATION_SECTION = 'Evaluation';
const TREATMENT_PLAN_SECTION = 'Treatment Plan';
const SCORING_PLAN_SECTION = 'Scoring Plan';

export const sections = [
  GENERAL_SECTION,
  EVALUATION_SECTION,
  TREATMENT_PLAN_SECTION,
  SCORING_PLAN_SECTION,
];

export const mapping = {
  collection: NonConformities,
  fields: {
    id: {
      section: GENERAL_SECTION,
      label: 'Non-conformity ID',
      required: true,
      reference: '_id',
    },
    name: {
      section: GENERAL_SECTION,
      label: 'Non-conformity name',
      required: true,
      reference: 'title',
    },
    description: {
      section: GENERAL_SECTION,
      label: 'Description',
    },
    status: {
      section: GENERAL_SECTION,
      label: 'Status',
      // mapper:
    },
    // statusComment: {
    //   section: GENERAL_SECTION,
    //   label: 'Status comment',
    // },
    standards: {
      section: GENERAL_SECTION,
      label: 'Standard(s)',
      reference: {
        from: CollectionNames.STANDARDS,
        internalField: 'standardsIds',
        externalField: '_id',
        target: 'title',
        many: true,
      },
    },
  },
};
