import { mergeDeepRight } from 'ramda';

export default mergeDeepRight({
  standards: {
    standardsFiltered: [],
  },
  collections: {
    standards: [
      { _id: 1 },
      { _id: 2 },
      { _id: 3, isDeleted: true, deletedAt: new Date() - 3 },
      { _id: 4, isDeleted: true, deletedAt: new Date() - 4 },
      { _id: 5 },
    ],
  },
  global: {
    filter: 1,
    searchText: '',
  },
});
