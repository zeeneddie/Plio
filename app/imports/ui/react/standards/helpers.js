import { CollectionNames } from '/imports/share/constants';
import {
  compose,
  find,
  propStandards,
  propSections,
  propEqId,
  propId,
  propEq,
  getC,
} from '/imports/api/helpers';
import { addCollapsed } from '/client/redux/actions/globalActions';

export const getSubNestingClassName = ({ nestingLevel = 1 }) =>
  'sub'.repeat(parseInt(nestingLevel, 10) - 1);

export const createSectionItem = key => ({
  key,
  type: CollectionNames.STANDARD_BOOK_SECTIONS,
});

export const createTypeItem = key => ({
  key,
  type: CollectionNames.STANDARD_TYPES,
});

export const findSelectedStandard = id =>
  compose(find(propEqId(id)), propStandards);

export const findSelectedSection = id =>
  compose(find(findSelectedStandard(id)), propSections);

export const addCollapsedType = compose(addCollapsed, createTypeItem, propId);

export const addCollapsedSection = compose(addCollapsed, createSectionItem, propId);

export const getSelectedAndDefaultStandardByFilter = ({
  sections, types, standards, filter, standardId,
}) => {
  const findStandard = findSelectedStandard(standardId);
  const findSection = findSelectedSection(standardId);
  switch (filter) {
    case 1: {
      const containedIn = sections.find(findStandard);
      return {
        containedIn,
        selected: findStandard(containedIn),
        default: getC('sections[0].standards[0]', { sections }),
      };
    }
    case 2: {
      const containedIn = types.find(findSection);
      return {
        containedIn,
        selected: findStandard(findSection(containedIn)),
        default: getC('types[0].sections[0].standards[0]', { types }),
      };
    }
    case 3: {
      const standardsDeleted = standards.filter(propEq('isDeleted', true));
      const containedIn = { standards: standardsDeleted };
      return {
        containedIn,
        selected: findStandard(containedIn),
        default: getC('standards[0]', containedIn),
      };
    }
    default: {
      const containedIn = { standards };
      return {
        containedIn,
        selected: null,
        default: getC('standards[0]', containedIn),
      };
    }
  }
};
