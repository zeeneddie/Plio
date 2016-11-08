import { CollectionNames } from '/imports/share/constants';
import { compose, find, propStandards, propSections, propEqId } from '/imports/api/helpers';

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

export const findSelectedStandard = standardId =>
  compose(find(propEqId(standardId)), propStandards);

export const findSelectedSection = standardId =>
  compose(find(findSelectedStandard(standardId)), propSections);
