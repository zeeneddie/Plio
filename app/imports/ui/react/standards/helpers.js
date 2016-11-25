import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { CollectionNames } from '/imports/share/constants';
import { STANDARD_FILTERS_MAP } from '/imports/api/constants';
import {
  compose,
  find,
  propStandards,
  propSections,
  propEqId,
  propId,
  propEq,
  getC,
  not,
  propIsDeleted,
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

export const getStandardsByFilter = ({ filter, standards }) => (
  filter === STANDARD_FILTERS_MAP.DELETED
    ? standards.filter(propEq('isDeleted', true))
    : standards.filter(compose(not, propIsDeleted))
);

export const addCollapsedType = compose(addCollapsed, createTypeItem, propId);

export const addCollapsedSection = compose(addCollapsed, createSectionItem, propId);

export const getSelectedAndDefaultStandardByFilter = ({
  sections, types, standards, filter, urlItemId,
}) => {
  const findStandard = findSelectedStandard(urlItemId);
  const findSection = findSelectedSection(urlItemId);
  switch (filter) {
    case 1: {
      const containedIn = sections.find(findStandard);
      return {
        containedIn,
        selected: findStandard(containedIn),
        default: getC('sections[0].standards[0]', { sections }),
        defaultContainedIn: _.first(sections),
      };
    }
    case 2: {
      //                  for normal types           for uncategorized type
      const containedIn = types.find(findSection) || types.find(findStandard);
      return {
        containedIn: { ...containedIn, children: [{ ...findSection(containedIn) }] },
        selected: findStandard(containedIn) || findStandard(findSection(containedIn)),
        default: getC('types[0].sections[0].standards[0]', { types }) ||
                 getC('types[0].standards[0]'),
        defaultContainedIn: {
          ..._.first(types),
          children: [
            { ...getC('types[0].sections[0]', { types }) },
          ],
        },
      };
    }
    case 3: {
      const standardsDeleted = standards.filter(propEq('isDeleted', true));
      const containedIn = { standards: standardsDeleted };
      return {
        containedIn,
        selected: findStandard(containedIn),
        default: getC('standards[0]', containedIn),
        defaultContainedIn: containedIn,
      };
    }
    default: {
      const containedIn = { standards };
      return {
        containedIn,
        selected: null,
        default: getC('standards[0]', containedIn),
        defaultContainedIn: containedIn,
      };
    }
  }
};

export const getPathToDiscussion = ({ orgSerialNumber, urlItemId, filter }) => {
  const params = { orgSerialNumber, urlItemId };
  const queryParams = { filter };

  return FlowRouter.path('standardDiscussion', params, queryParams);
};
