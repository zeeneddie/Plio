import { mergeDeepRight } from 'ramda';

export default mergeDeepRight({
  standards: {
    standardsFiltered: [],
  },
  collections: {
    standards: [
      { _id: 1 },
      { _id: 2 },
      { _id: 3, isDeleted: true, deletedAt: 1513074233019 },
      { _id: 4, isDeleted: true, deletedAt: 1513074233018 },
      { _id: 5 },
    ],
    standardsByIds: {
      1: { _id: 1 },
      2: { _id: 2 },
      3: { _id: 3, isDeleted: true, deletedAt: 1513074233019 },
      4: { _id: 4, isDeleted: true, deletedAt: 1513074233018 },
      5: { _id: 5 },
    },
    users: [
      { _id: 6 },
    ],
    usersByIds: {
      6: { _id: 6 },
    },
  },
  global: {
    filter: 1,
    searchText: '',
    isCardReady: true,
    isFullScreenMode: false,
    urlItemId: 1,
    userId: 1,
  },
});
