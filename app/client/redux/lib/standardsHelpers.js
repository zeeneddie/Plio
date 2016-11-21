import property from 'lodash.property';
import { UncategorizedTypeSection } from '/imports/api/constants';

import {
  propEqId,
  lengthStandards,
  lengthSections,
  compose,
  not,
  propStandards,
  equals,
  getC,
  flattenMapStandards,
} from '/imports/api/helpers';

const getTotalUnreadMessagesCount = (array = []) =>
  array.reduce((prev, { unreadMessagesCount = 0 }) => prev + unreadMessagesCount, 0);

export const initSections = ({ types, sections, standards }) => {
  const standardsWithType = standards.map((standard) => {
    const type = types.find(propEqId(standard.typeId)) ||
                 UncategorizedTypeSection;
    return { ...standard, type };
  });
  const mapper = (section) => {
    const ownStandards = standardsWithType
      .filter((standard) => {
        return !standard.isDeleted &&
               standard.sectionId === section._id;
      });
    const unreadMessagesCount = getTotalUnreadMessagesCount(ownStandards);

    return {
      ...section,
      unreadMessagesCount,
      standards: ownStandards,
    };
  };

  const sectionsWithStandards = sections.map(mapper);
  const uncategorizedStandards = standardsWithType
    .filter(standard => !sections.find(propEqId(standard.sectionId)));
  const uncategorizedSection = {
    _id: 'StandardBookSections.Uncategorized',
    title: 'Uncategorized',
    standards: uncategorizedStandards,
    organizationId: getC('organizationId', standards[0]),
    unreadMessagesCount: getTotalUnreadMessagesCount(uncategorizedStandards),
  };

  return sectionsWithStandards
    .concat([uncategorizedSection])
    .filter(lengthStandards);
};

export const initTypes = ({ sections, types }) => {
  const getTotalUnreadMessagesCount = (array = []) =>
    array.reduce((prev, cur) => prev + cur.unreadMessagesCount, 0);
  const uncategorizedStandards = flattenMapStandards(sections)
    .filter(standard => !types.find(propEqId(standard.typeId)));
  const uncategorizedType = {
    _id: 'StandardTypes.Uncategorized',
    title: 'Uncategorized',
    standards: uncategorizedStandards,
    unreadMessagesCount: getTotalUnreadMessagesCount(uncategorizedStandards),
  };

  const result = types.map((type) => {
    const ownSections = sections.map((section) => {
      const standards = section.standards.filter((standard) => {
        return !standard.isDeleted &&
               standard.typeId === type._id;
      });

      const unreadMessagesCount = getTotalUnreadMessagesCount(standards);

      return { ...section, unreadMessagesCount, standards };
    }).filter(lengthStandards);

    const unreadMessagesCount = getTotalUnreadMessagesCount(ownSections);

    return { ...type, unreadMessagesCount, sections: ownSections };
  }).filter(lengthSections);

  return lengthStandards(uncategorizedType)
    ? result.concat([uncategorizedType])
    : result;
};

export const initStandards = ({ sections, types, standards, unreadMessagesCountMap = {} }) =>
  standards.map((standard) => {
    const section = sections.find(propEqId(standard.sectionId));
    const type = types.find(propEqId(standard.typeId));

    return {
      ...standard,
      section,
      type,
      unreadMessagesCount: unreadMessagesCountMap[standard._id] || 0,
    };
  });
