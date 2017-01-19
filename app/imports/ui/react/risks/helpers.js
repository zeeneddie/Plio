import { _ } from 'meteor/underscore';
import { withProps } from 'recompose';
import curry from 'lodash.curry';

import { TYPE_UNCATEGORIZED } from './constants';
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
export const createRiskDepartmentItem = curry(createTypeItem)(CollectionNames.DEPARTMENTS);

export const findSelectedRisk = id =>
  compose(find(propEqId(id)), propRisks);

export const getRisksByFilter = ({ filter, risks }) => (
  filter === RiskFilterIndexes.DELETED
    ? risks.filter(propEq('isDeleted', true))
    : risks.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createRiskTypeItem, propId);

export const createUncategorizedType = ({ risks, types }) => {
  return ({
    _id: TYPE_UNCATEGORIZED,
    title: 'Uncategorized',
    organizationId: getC('organizationId', risks[0]),
    risks: risks.filter(risk => !types.find(propEqId(risk.typeId))),
  });
};

export const createUncategorizedDepartment = ({ risks, departments }) => {
  return ({
    _id: TYPE_UNCATEGORIZED,
    name: 'Uncategorized',
    organizationId: getC('organizationId', risks[0]),
    risks: risks.filter(risk => !departments.find(
      department => _.contains(risk.departmentsIds, department._id)
    )),
  });
};

export const getSelectedAndDefaultRiskByFilter = ({
  statuses, departments, types, risks, filter, urlItemId,
}) => {
  const findRisk = findSelectedRisk(urlItemId);
  switch (filter) {
    case RiskFilterIndexes.STATUS: {
      const containedIn = statuses.find(findRisk);
      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('statuses[0].risks[0]', { statuses }),
        defaultContainedIn: _.first(statuses),
      };
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const containedIn = departments.find(findRisk);

      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('departments[0].risks[0]', { departments }),
        defaultContainedIn: _.first(departments),
      };
    }
    case RiskFilterIndexes.TYPE: {
      const containedIn = types.find(findRisk);
      return {
        containedIn,
        selectedRisk: findRisk(containedIn),
        defaultRisk: getC('types[0].risks[0]', { types }),
        defaultContainedIn: _.first(types),
      };
    }
    case RiskFilterIndexes.DELETED:
    default:
      return {
        selectedRisk: findRisk({ risks }),
        defaultRisk: getC('risks[0]', { risks }),
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
    case RiskFilterIndexes.TYPE:
    default: {
      const typeItem = createRiskTypeItem(topLevelKey);
      result = dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
      break;
    }
    case RiskFilterIndexes.STATUS: {
      // todo: move RISK.STATUSES to constant
      const statusItem = createTypeItem('RISK.STATUSES', parentItem.number);
      result = dispatch(addCollapsed({ ...statusItem, close: { type: statusItem.type } }));
      break;
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const departmentItem = createRiskDepartmentItem(topLevelKey);
      result = dispatch(addCollapsed({ ...departmentItem, close: { type: departmentItem.type } }));
      break;
    }
    case RiskFilterIndexes.DELETED: {
      result = null;
      break;
    }
  }

  return result;
};

export const expandCollapsedRisk = (_id) => {
  const { collections: { risksByIds }, global: { filter } } = getState();
  const risk = { ...risksByIds[_id] };
  const typeItem = createRiskTypeItem(risk.typeId);
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
    collections: { risks, riskBookSections, riskTypes },
    global: { filter, collapsed },
  } = getState();

  const notCollapsed = _id => !collapsed.find(propEq('key', _id)); // reject already expanded
  const risksFound = risks.filter(risk => ids.includes(risk._id));

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      const uncategorizedType = createUncategorizedType({
        risks: risksFound,
        types: riskTypes,
      });
      let types = riskTypes.filter(type =>
        notCollapsed(type._id) &&
        risksFound.filter(propEq('typeId', type._id)).length
      );

      types = uncategorizedType.risks.length
        ? types.concat(uncategorizedType)
        : types;

      return store.dispatch(chainActions(
        types.map(addCollapsedType)
      ));
    }
    default:
      return false;
  }
};

export const collapseExpandedRisks = () => {
  const {
    collections: { risksByIds, riskTypesByIds, departmentsByIds },
    global: { filter, urlItemId },
  } = getState();
  // expand section and type with currently selected risk and close others
  const selectedRisk = risksByIds[urlItemId];

  if (!selectedRisk) return false;

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      // if risks are filtered by 'type'
      // collapse all types and sections except the one that is holding selected risk
      const selectedType = riskTypesByIds[selectedRisk.typeId] ||
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
  risk: findSelectedRisk(props.urlItemId)(props),
}));

export const getSelectedRiskDeletedState = state => ({
  isSelectedRiskDeleted: getC(
    'isDeleted',
    state.collections.risksByIds[state.global.urlItemId]
  ),
});
