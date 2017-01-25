import { _ } from 'meteor/underscore';
import { withProps } from 'recompose';
import property from 'lodash.property';

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
  pickDeep,
  includes,
} from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';
import { goTo } from '../../utils/router/actions';
import store, { getState } from '/imports/client/store';
import {
  createTypeItem,
  getListData,
  handleRedirectAndOpen,
  withRedirectAndOpen,
} from '../helpers';
import { problemsStatuses } from '../problems/constants';

export const goToRisk = goTo('risk');
export const goToRisks = goTo('risks');

export const createRiskTypeItem = createTypeItem(CollectionNames.RISK_TYPES);
export const createRiskDepartmentItem = createTypeItem(CollectionNames.DEPARTMENTS);
export const createRiskStatusItem = createTypeItem('RISK.STATUSES');

export const findSelectedRisk = id =>
  compose(find(propEqId(id)), propRisks);

export const getRisksByFilter = ({ filter, risks }) => (
  filter === RiskFilterIndexes.DELETED
    ? risks.filter(propEq('isDeleted', true))
    : risks.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createRiskTypeItem, propId);
export const addCollapsedStatus = compose(addCollapsed, createRiskStatusItem, property('number'));
export const addCollapsedDepartment = compose(addCollapsed, createRiskDepartmentItem, propId);

export const createUncategorizedType = ({ risks, types }) => ({
  _id: TYPE_UNCATEGORIZED,
  title: 'Uncategorized',
  organizationId: getC('organizationId', risks[0]),
  risks: risks.filter(risk => !find(propEqId(risk.typeId), types)),
});

export const createUncategorizedDepartment = ({ risks, departments }) => ({
  _id: TYPE_UNCATEGORIZED,
  name: 'Uncategorized',
  organizationId: getC('organizationId', risks[0]),
  risks: risks.filter(risk => !find(
    department => _.contains(risk.departmentsIds, department._id),
    departments
  )),
});

export const getRiskListData = getListData('risks');

export const handleRisksRedirectAndOpen = handleRedirectAndOpen(
  getRiskListData,
  goToRisk,
  goToRisks
);

export const withRisksRedirectAndOpen = withRedirectAndOpen(
  (props, nextProps) => (!props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) ||
    (nextProps.searchText && nextProps.risksFiltered.length),
  pickDeep(['global.searchText', 'risks.risksFiltered', 'collections.risksByIds']),
);

export const expandCollapsedRisk = (_id) => {
  const { collections: { risksByIds }, global: { filter } } = getState();
  const risk = { ...risksByIds[_id] };
  let action;

  if (!risk) return false;

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      const typeItem = createRiskTypeItem(risk.typeId);
      action = addCollapsed({ ...typeItem, close: { type: typeItem.type } });
      break;
    }
    case RiskFilterIndexes.STATUS: {
      const statusItem = createRiskStatusItem(risk.status);
      action = addCollapsed({ ...statusItem, close: { type: statusItem.type } });
      break;
    }
    case RiskFilterIndexes.DEPARTMENT:
      action = chainActions(Object.assign([], risk.departmentsIds).map(addCollapsedDepartment));
      break;
    default:
      return false;
  }

  return store.dispatch(action);
};

export const expandCollapsedRisks = (ids) => {
  const {
    collections: { risks, riskTypes, departments },
    global: { filter, collapsed },
  } = getState();

  const notCollapsed = key => !collapsed.find(propEq('key', key)); // reject already expanded
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

      return store.dispatch(chainActions(types.map(addCollapsedType)));
    }
    case RiskFilterIndexes.STATUS: {
      const statuses = problemsStatuses.filter(({ number }) =>
        notCollapsed(number) &&
        risksFound.filter(propEq('status', Number(number))).length);

      return store.dispatch(chainActions(statuses.map(addCollapsedStatus)));
    }
    case RiskFilterIndexes.DEPARTMENT: {
      let dps = departments.filter(({ _id }) => !!(
        notCollapsed(_id) &&
        risksFound.filter(compose(includes(_id), property('departmentsIds'))).length
      ));
      const uncategorizedDepartment = createUncategorizedDepartment({
        departments,
        risks: risksFound,
      });

      dps = uncategorizedDepartment.risks.length
        ? dps.concat(uncategorizedDepartment)
        : dps;

      return store.dispatch(chainActions(dps.map(addCollapsedDepartment)));
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
  // expand type with currently selected risk and close others
  const selectedRisk = risksByIds[urlItemId];
  const addClose = item => ({
    ...item,
    close: { type: item.type },
  });

  if (!selectedRisk) return false;

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      // if risks are filtered by 'type'
      // collapse all types except the one that is holding selected risk
      const selectedType = riskTypesByIds[selectedRisk.typeId] ||
        { _id: TYPE_UNCATEGORIZED };
      const selectedTypeItem = createRiskTypeItem(getId(selectedType));
      const typeCollapseAction = addCollapsed(addClose(selectedTypeItem));

      return store.dispatch(typeCollapseAction);
    }
    case RiskFilterIndexes.STATUS: {
      const selectedStatusItem = createRiskStatusItem(String(selectedRisk.status));
      const statusCollapseAction = addCollapsed(addClose(selectedStatusItem));

      return store.dispatch(statusCollapseAction);
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const selectedDepartments = Object.assign([], selectedRisk.departmentsIds)
        .map(id => departmentsByIds[id]);
      const selectedDepartmentsItems = selectedDepartments.map(createRiskDepartmentItem);
      const departmentsCollapseActions = selectedDepartmentsItems.map(
        compose(addCollapsed, addClose)
      );

      return store.dispatch(chainActions(departmentsCollapseActions));
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
