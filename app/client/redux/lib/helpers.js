import {
  assoc,
  mapByIndex,
  propEq,
  lengthStandards,
  lengthSections
} from '/imports/api/helpers';

export const collapse = (collapsed, index, items, shouldCloseOthers = true) => {
  if (shouldCloseOthers) {
    return items.map((item, i) => {
      return i === index ? { ...item, collapsed } : { ...item, collapsed: true };
    });
  }

  return mapByIndex({ collapsed }, index, items);
}

export const toggleCollapse = (index, items, shouldCloseOthers = true) =>
  collapse(!items[index].collapsed, index, items, shouldCloseOthers);

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
      collapsed: !ownStandards.find(propEq('_id', standardId)),
      standards: ownStandards,
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

    const collapsed = !sections.find(propEq('collapsed', false));

    return {...type, sections, collapsed };
  }).filter(lengthSections);
};
