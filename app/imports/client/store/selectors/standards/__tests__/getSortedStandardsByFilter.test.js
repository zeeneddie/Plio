import getSortedStandardsByFilter from '../getSortedStandardsByFilter';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';

describe('getSortedStandardsByFilter', () => {
  const standards = [
    { _id: 1 },
    { _id: 2 },
    { _id: 3, isDeleted: true, deletedAt: new Date() - 3 },
    { _id: 4, isDeleted: true, deletedAt: new Date() - 4 },
    { _id: 5 },
  ];

  it('sorts by title when is not deleted filter', () => {
    const state = {
      standards: {
        standardsFiltered: [2, 3, 4, 5],
      },
      collections: { standards },
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
      },
    };
    const expected = [standards[1], standards[4]];

    expect(getSortedStandardsByFilter(state)).toEqual(expected);
  });

  it('sorts by deletedAt when is deleted filter', () => {
    const state = {
      standards: {
        standardsFiltered: [2, 3, 4],
      },
      collections: { standards },
      global: {
        filter: STANDARD_FILTER_MAP.DELETED,
      },
    };
    const expected = [standards[2], standards[3]];

    expect(getSortedStandardsByFilter(state)).toEqual(expected);
  });
});
