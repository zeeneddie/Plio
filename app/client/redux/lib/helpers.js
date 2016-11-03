import {
  assoc,
  mapByIndex,
  propEq,
  lengthStandards
} from '/imports/api/helpers';

export const toggleSection = (state, action) => {
  const { index, shouldCloseOthers } = action.payload;
  const section = state.sections[index];
  let sections;

  if (shouldCloseOthers) {
    sections = state.sections.map((section, i) => {
      return i === index
        ? { ...section, collapsed: !section.collapsed }
        : { ...section, collapsed: true };
    });
  } else {
    sections = mapByIndex(
      assoc('collapsed', !section.collapsed, section),
      index,
      state.sections
    );
  }

  return { ...state, sections };
};

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
      standards: ownStandards,
      collapsed: !ownStandards.find(propEq('_id', standardId))
    };
  };

  return {
    ...state,
    sections: sections.map(mapper).filter(lengthStandards)
  };
};
