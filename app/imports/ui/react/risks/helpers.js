import { _ } from 'meteor/underscore';
import { withProps } from 'recompose';
import curry from 'lodash.curry';

import { CollectionNames } from '/imports/share/constants';
import { RiskFilterIndexes } from '/imports/api/constants';
import {
  compose,
  find,
  propRisks,
  propEqId,
  propId,
  propEq,
  getC,
  notDeleted,
  getId,
} from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';
import { goTo } from '../../utils/router/actions';
import store, { getState } from '/imports/client/store';
import { createTypeItem } from '../helpers/createTypeItem';

export const getSubNestingClassName = ({ nestingLevel = 1 }) =>
  'sub'.repeat(parseInt(nestingLevel, 10) - 1);

export const createRiskTypeItem = curry(createTypeItem)(CollectionNames.RISK_TYPES);

export const findSelectedRisk = id =>
  compose(find(propEqId(id)), propRisks);

export const getRisksByFilter = ({ filter, standards }) => (
  filter === RiskFilterIndexes.DELETED
    ? standards.filter(propEq('isDeleted', true))
    : standards.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createRiskTypeItem, propId);

export const createUncategorizedType = ({ standards, types }) => ({
  _id: 'TYPE_UNCATEGORIZED',
  title: 'Uncategorized',
  organizationId: getC('organizationId', standards[0]),
  standards: standards.filter(standard => !types.find(propEqId(standard.typeId))),
});

export const getSelectedAndDefaultRiskByFilter = ({
  sections, types, standards, filter, urlItemId,
}) => {
  const findRisk = findSelectedRisk(urlItemId);
  switch (filter) {
    case RiskFilterIndexes.STATUS: {
      const containedIn = sections.find(findRisk);
      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('sections[0].standards[0]', { sections }),
        defaultContainedIn: _.first(sections),
      };
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const containedIn = sections.find(findRisk);
      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('sections[0].standards[0]', { sections }),
        defaultContainedIn: _.first(sections),
      };
    }
    case RiskFilterIndexes.TYPE: {
      const containedIn = types.find(findRisk);
      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('types[0].standards[0]', { types }),
        defaultContainedIn: _.first(types),
      };
    }
    case RiskFilterIndexes.DELETED:
    default:
      return {
        selectedRisk: findRisk({ standards }),
        defaultRisk: getC('standards[0]', { standards }),
        containedIn: null,
        defaultContainedIn: null,
      };
  }
};

export const redirectToRiskOrDefault = ({
  selectedRisk,
  defaultRisk,
}) => !selectedRisk && (
  defaultRisk
    ? goTo('risk')({ urlItemId: getId(defaultRisk) })
    : goTo('risks')()
);

export const openRiskByFilter = ({
  selectedRisk,
  containedIn,
  defaultContainedIn,
  filter,
  dispatch,
}) => {
  const parentItem = selectedRisk ? containedIn : defaultContainedIn;
  const topLevelKey = getId(parentItem);
  let result;

  switch (filter) {
    case 1:
    default: {
      const typeItem = createRiskTypeItem(topLevelKey);
      result = dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
      break;
    }
    case 2: {
      result = null;
      break;
    }
  }

  return result;
};

export const expandCollapsedRisk = (_id) => {
  const { collections: { standardsByIds }, global: { filter } } = getState();
  const standard = { ...standardsByIds[_id] };
  const typeItem = createRiskTypeItem(standard.typeId);
  let action;

  switch (filter) {
    case RiskFilterIndexes.TYPE:
      action = chainActions(
        [typeItem, sectionItem].map(item => addCollapsed({ ...item, close: { type: item.type } }))
      );
      break;
    default:
      return false;
  }

  return store.dispatch(action);
};

export const expandCollapsedRisks = (ids) => {
  const {
    collections: { standards, standardBookSections, standardTypes },
    global: { filter, collapsed },
  } = getState();

  const notCollapsed = _id => !collapsed.find(propEq('key', _id)); // reject already expanded
  const standardsFound = standards.filter(standard => ids.includes(standard._id));
  const uncategorizedSection = createUncategorizedSection({
    sections: standardBookSections,
    standards: standardsFound,
  });
  let sections = standardBookSections.filter(section =>
    notCollapsed(section._id) &&
    standardsFound.filter(propEq('sectionId', section._id)).length
  );

  sections = uncategorizedSection.standards.length
    ? sections.concat(uncategorizedSection)
    : sections;

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      const uncategorizedType = createUncategorizedType({
        standards: standardsFound,
        types: standardTypes,
      });
      let types = standardTypes.filter(type =>
        notCollapsed(type._id) &&
        standardsFound.filter(propEq('typeId', type._id)).length
      );

      types = uncategorizedType.standards.length
        ? types.concat(uncategorizedType)
        : types;

      return store.dispatch(chainActions(
        types.map(addCollapsedType).concat(sections.map(addCollapsedSection))
      ));
    }
    default:
      return false;
  }
};

export const collapseExpandedRisks = () => {
  const {
    collections: { standardsByIds, standardTypesByIds, standardBookSectionsByIds },
    global: { filter, urlItemId },
  } = getState();
  // expand section and type with currently selected standard and close others
  const selectedRisk = standardsByIds[urlItemId];

  if (!selectedRisk) return false;

  const selectedSection = standardBookSectionsByIds[selectedRisk.sectionId] ||
    { _id: SECTION_UNCATEGORIZED };
  const selectedSectionItem = createSectionItem(getId(selectedSection));
  const addClose = item => ({
    ...item,
    close: { type: item.type },
  });
  const sectionCollapseAction = addCollapsed(addClose(selectedSectionItem));

  switch (filter) {
    case STANDARD_FILTER_MAP.TYPE: {
      // if standards are filtered by 'type'
      // collapse all types and sections except the one that is holding selected standard
      const selectedType = standardTypesByIds[selectedRisk.typeId] ||
        { _id: TYPE_UNCATEGORIZED };
      const selectedTypeItem = createRiskTypeItem(getId(selectedType));
      const typeCollapseAction = addCollapsed(addClose(selectedTypeItem));

      return store.dispatch(chainActions([typeCollapseAction, sectionCollapseAction]));
    }
    default:
      return false;
  }
};

export const withRisk = withProps(props => ({
  standard: findSelectedRisk(props.urlItemId)(props),
}));

export const getSelectedRiskDeletedState = state => ({
  isSelectedRiskDeleted: getC(
    'isDeleted',
    state.collections.standardsByIds[state.global.urlItemId]
  ),
});
