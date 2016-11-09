import property from 'lodash.property';

import {
  propEqId,
  lengthStandards,
  lengthSections,
  compose,
  not,
} from '/imports/api/helpers';

export const initSections = (state, sections) => {
  const {
    standards,
    types,
  } = state;

  const mapper = (section) => {
    const ownStandards = standards
      .filter((standard) => {
        return !standard.isDeleted &&
               standard.sectionId === section._id;
      })
      .map((standard) => {
        const type = types.find(propEqId(standard.typeId)) || UncategorizedTypeSection;
        return { ...standard, type };
      });

    return {
      ...section,
      standards: ownStandards,
    };
  };

  return sections.map(mapper).filter(lengthStandards);
};

export const initTypes = (state, types) => {
  return types.map((type) => {
    const sections = state.sections.map((section) => {
      const standards = section.standards.filter((standard) => {
        return !standard.isDeleted &&
               standard.typeId === type._id &&
               standard.sectionId === section._id;
      });

      return { ...section, standards };
    }).filter(lengthStandards);

    return { ...type, sections };
  }).filter(lengthSections);
};

export const initStandards = (state, standards) =>
  standards.map((standard) => {
    const section = state.sections.find(propEqId(standard.sectionId));
    const type = state.types.find(propEqId(standard.typeId));

    return {
      ...standard,
      section,
      type,
    };
  });
