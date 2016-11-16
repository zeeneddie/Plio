import property from 'lodash.property';

import {
  propEqId,
  lengthStandards,
  lengthSections,
  compose,
  not,
  propStandards,
  equals,
  getC,
} from '/imports/api/helpers';

export const initSections = ({ types, sections, standards }) => {
  const standardsWithType = standards.map((standard) => {
    const type = types.find(propEqId(standard.typeId)) || UncategorizedTypeSection;
    return { ...standard, type };
  });
  const mapper = (section) => {
    const ownStandards = standardsWithType
      .filter((standard) => {
        return !standard.isDeleted &&
               standard.sectionId === section._id;
      });

    return {
      ...section,
      standards: ownStandards,
    };
  };

  const sectionsWithStandards = sections.map(mapper);
  const uncategorizedStandards = standardsWithType.filter(standard => !sections.find(propEqId(standard.sectionId)));
  const uncategorizedSection = {
    _id: 'StandardBookSections.Uncategorized',
    title: 'Uncategorized',
    standards: uncategorizedStandards,
    organizationId: getC('organizationId', standards[0]),
  };

  return sectionsWithStandards.concat([uncategorizedSection]).filter(lengthStandards);
};

export const initTypes = ({ sections, types }) => {
  return types.map((type) => {
    const ownSections = sections.map((section) => {
      const standards = section.standards.filter((standard) => {
        return !standard.isDeleted &&
               standard.typeId === type._id &&
               standard.sectionId === section._id;
      });

      return { ...section, standards };
    }).filter(lengthStandards);

    return { ...type, sections: ownSections };
  }).filter(lengthSections);
};

export const initStandards = ({ sections, types, standards }) =>
  standards.map((standard) => {
    const section = sections.find(propEqId(standard.sectionId));
    const type = types.find(propEqId(standard.typeId));

    return {
      ...standard,
      section,
      type,
    };
  });
