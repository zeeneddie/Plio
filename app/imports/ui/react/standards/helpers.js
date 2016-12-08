import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withProps } from 'recompose';

import { CollectionNames } from '/imports/share/constants';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import {
  compose,
  find,
  propStandards,
  propSections,
  propEqId,
  propId,
  propEq,
  getC,
  notDeleted,
  getId,
} from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/client/redux/actions/globalActions';
import { goToStandard, goToStandards } from '../helpers/routeHelpers';
import store, { getState } from '/client/redux/store';

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
  filter === STANDARD_FILTER_MAP.DELETED
    ? standards.filter(propEq('isDeleted', true))
    : standards.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createTypeItem, propId);

export const addCollapsedSection = compose(addCollapsed, createSectionItem, propId);

export const getSelectedAndDefaultStandardByFilter = ({
  sections, types, standards, filter, urlItemId,
}) => {
  const findStandard = findSelectedStandard(urlItemId);
  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION: {
      const containedIn = sections.find(findStandard);
      return {
        containedIn,
        selectedStandard: findStandard(containedIn),
        defaultStandard: getC('sections[0].standards[0]', { sections }),
        defaultContainedIn: _.first(sections),
      };
    }
    case STANDARD_FILTER_MAP.TYPE: {
      const containedIn = types.find(findStandard);
      return {
        containedIn,
        selectedStandard: findStandard(containedIn),
        defaultStandard: getC('types[0].standards[0]', { types }),
        defaultContainedIn: _.first(types),
      };
    }
    case STANDARD_FILTER_MAP.DELETED: {
      const standardsDeleted = standards.filter(propEq('isDeleted', true));
      const containedIn = { standards: standardsDeleted };
      return {
        containedIn,
        selectedStandard: findStandard(containedIn),
        defaultStandard: getC('standards[0]', containedIn),
        defaultContainedIn: containedIn,
      };
    }
    default: {
      const containedIn = { standards };
      return {
        containedIn,
        selectedStandard: null,
        defaultStandard: getC('standards[0]', containedIn),
        defaultContainedIn: containedIn,
      };
    }
  }
};

export const redirectToStandard = ({ selectedStandard, defaultStandard }) => !selectedStandard && (
  defaultStandard
    ? goToStandard({ urlItemId: getId(defaultStandard) })
    : goToStandards()
);

export const openStandardByFilter = ({
  selectedStandard,
  containedIn,
  defaultContainedIn,
  filter,
  dispatch,
}) => {
  const parentItem = selectedStandard ? containedIn : defaultContainedIn;
  const topLevelKey = getId(parentItem);
  let result;

  switch (filter) {
    case 1:
    default: {
      const sectionItem = createSectionItem(topLevelKey);
      result = dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
      break;
    }
    case 2: {
      const typeItem = createTypeItem(topLevelKey);
      result = dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
      break;
    }
    case 3:
      result = null;
      break;
  }

  return result;
};

export const expandCollapsedStandard = (_id) => {
  const { collections: { standardsByIds }, global: { filter } } = getState();
  const standard = { ...standardsByIds[_id] };
  const sectionItem = createSectionItem(standard.sectionId);
  const typeItem = createTypeItem(standard.typeId);
  let action;

  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
      action = addCollapsed({ ...sectionItem, close: { type: sectionItem.type } });
      break;
    case STANDARD_FILTER_MAP.TYPE:
      action = chainActions(
        [typeItem, sectionItem].map(item => addCollapsed({ ...item, close: { type: item.type } }))
      );
      break;
    default:
      return false;
  }

  return store.dispatch(action);
};

export const getPathToDiscussion = ({ orgSerialNumber, urlItemId, filter }) => {
  const params = { orgSerialNumber, urlItemId };
  const queryParams = { filter };

  return FlowRouter.path('standardDiscussion', params, queryParams);
};

export const withStandard = withProps(props => ({
  standard: findSelectedStandard(props.urlItemId)(props),
}));
