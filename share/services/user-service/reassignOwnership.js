import { reduce, lensPath, lensProp, set, when, evolve, equals, always } from 'ramda';

const improvementPlan = ['improvementPlan', 'owner'];
const analysis = [['analysis', 'executor'], ['analysis', 'completedBy']];
const updateOfStandards = [
  ['updateOfStandards', 'executor'],
  ['updateOfStandards', 'completedBy'],
];
const problemFields = [
  'ownerId',
  'originatorId',
  improvementPlan,
  ...analysis,
  ...updateOfStandards,
];
const canvasFields = ['originatorId'];

export default async function reassignOwnership(args, context) {
  const { organizationId, userId, ownerId } = args;
  const {
    collections: {
      Actions,
      LessonsLearned,
      NonConformities,
      Risks,
      Standards,
      WorkItems,
      Goals,
      KeyPartners,
      KeyActivities,
      KeyResources,
      CostLines,
      CustomerRelationships,
      Channels,
      ValuePropositions,
      CustomerSegments,
      RevenueStreams,
      Organizations,
    },
  } = context;
  const applyReassign = (keys, collection, query = { organizationId }) => {
    const rawCollection = collection.rawCollection();
    return collection.find(query).map(async (doc) => {
      const transformations = reduce((acc, key) => set(
        Array.isArray(key) ? lensPath(key) : lensProp(key),
        when(equals(userId), always(ownerId)),
        acc,
      ), {}, keys);
      const transformed = evolve(transformations, doc);

      return rawCollection.save(transformed);
    });
  };

  const promises = [
    applyReassign(
      ['completedBy', 'toBeVerifiedBy', 'verifiedBy', 'ownerId', 'toBeCompletedBy'],
      Actions,
    ),
    applyReassign(['owner'], LessonsLearned),
    applyReassign(problemFields, NonConformities),
    applyReassign(problemFields, Risks),
    applyReassign(['owner', improvementPlan], Standards),
    applyReassign(['assigneeId'], WorkItems),
    applyReassign(['ownerId', 'completedBy'], Goals),
    applyReassign(canvasFields, KeyPartners),
    applyReassign(canvasFields, KeyActivities),
    applyReassign(canvasFields, KeyResources),
    applyReassign(canvasFields, CostLines),
    applyReassign(canvasFields, CustomerRelationships),
    applyReassign(canvasFields, Channels),
    applyReassign(canvasFields, ValuePropositions),
    applyReassign(canvasFields, CustomerSegments),
    applyReassign(canvasFields, RevenueStreams),
    applyReassign(
      [
        ['review', 'risks', 'reviewerId'],
        ['review', 'standards', 'reviewerId'],
      ],
      Organizations,
      { _id: organizationId },
    ),
  ];

  return Promise.all(promises).then(array => Promise.all(...array));
}
