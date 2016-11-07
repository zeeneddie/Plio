import {
  propEq,
  lengthStandards,
  lengthSections
} from '/imports/api/helpers';

export const mapSections = (state, sections) => {
  const {
    standards,
    types,
    standardId
  } = state;

  const mapper = (section) => {
    const ownStandards = standards
      .filter(propEq('sectionId', section._id))
      .map((standard) => {
        const type = types.find(propEq('_id', standard.typeId)) || UncategorizedTypeSection;
        return { ...standard, type };
      });

    return {
      ...section,
      standards: ownStandards
    };
  };

  return sections.map(mapper).filter(lengthStandards);
};

export const mapTypes = (state, types) => {
  return types.map((type) => {
    const sections = state.sections.map((section) => {
      const standards = section.standards.filter((standard) => {
        return standard.typeId === type._id &&
               standard.sectionId === section._id;
      });

      return { ...section, standards };
    }).filter(lengthStandards);

    return { ...type, sections };
  }).filter(lengthSections);
};
