import { _ } from 'meteor/underscore';
import property from 'lodash.property';

import { TYPE_UNCATEGORIZED, RISK_STATUSES } from './constants';
import { CollectionNames } from '/imports/share/constants';
import { RiskFilterIndexes, DEPARTMENT_UNCATEGORIZED } from '/imports/api/constants';
import {
  compose,
  find,
  propEqId,
  propId,
  propEq,
  getC,
  notDeleted,
  getId,
  pickDeep,
  includes,
  some,
  every,
  filterC,
  propEqType,
  mapC,
  not,
  propEqKey,
} from '/imports/api/helpers';
import {
  addCollapsed,
  chainActions,
  addCollapsedWithClose,
} from '/imports/client/store/actions/globalActions';
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
export const createRiskStatusItem = createTypeItem(RISK_STATUSES);

export const getRisksByFilter = ({ filter, risks }) => (
  filter === RiskFilterIndexes.DELETED
    ? risks.filter(propEq('isDeleted', true))
    : risks.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createRiskTypeItem, propId);
export const addCollapsedStatus = compose(addCollapsed, createRiskStatusItem, property('value'));
export const addCollapsedDepartment = compose(addCollapsed, createRiskDepartmentItem, propId);

export const createUncategorizedType = ({ risks, types }) => ({
  _id: TYPE_UNCATEGORIZED,
  title: 'Uncategorized',
  organizationId: getC('organizationId', risks[0]),
  risks: risks.filter(risk => !find(propEqId(risk.typeId), types)),
});

export const createUncategorizedDepartment = ({ risks, departments }) => ({
  _id: DEPARTMENT_UNCATEGORIZED,
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
    (nextProps.searchText && nextProps.risksFiltered.length) ||
    !props.areDepsReady && nextProps.areDepsReady,
  pickDeep([
    'global.searchText',
    'risks.risksFiltered',
    'collections.risksByIds',
    'risks.areDepsReady',
  ]),
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

  const notCollapsed = key => !collapsed.find(propEqKey(key)); // reject already expanded
  const risksFound = risks.filter(risk => ids.includes(risk._id));

  const getExpandedFiltered = (prop, predicate) => filterC(every([
    compose(notCollapsed, property(prop)),
    obj => filterC(predicate(obj), risksFound).length,
  ]));

  switch (filter) {
    case RiskFilterIndexes.TYPE: {
      const uncategorizedType = createUncategorizedType({
        risks: risksFound,
        types: riskTypes,
      });
      const getTypes = getExpandedFiltered('_id', compose(propEq('typeId'), property('_id')));
      const types = getTypes(riskTypes);
      const resultTypes = uncategorizedType.risks.length
        ? types.concat(uncategorizedType)
        : types;
      const actions = mapC(addCollapsedType, resultTypes);

      return store.dispatch(chainActions(actions));
    }
    case RiskFilterIndexes.STATUS: {
      const getStatuses = getExpandedFiltered(
        'value',
        compose(propEq('status'), property('value')),
      );
      const statuses = getStatuses(problemsStatuses);
      const actions = mapC(addCollapsedStatus, statuses);

      return store.dispatch(chainActions(actions));
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const getDepartments = getExpandedFiltered(
        '_id',
        ({ _id }) => compose(includes(_id), property('departmentsIds'))
      );
      const filteredDepartments = getDepartments(departments);

      const uncategorizedDepartment = createUncategorizedDepartment({
        departments,
        risks: risksFound,
      });

      const resultDepartments = uncategorizedDepartment.risks.length
        ? filteredDepartments.concat(uncategorizedDepartment)
        : filteredDepartments;

      const actions = mapC(addCollapsedDepartment, resultDepartments);

      return store.dispatch(chainActions(actions));
    }
    default:
      return false;
  }
};

export const collapseExpandedRisks = () => {
  // close all collapses except selected
  const {
    collections: { risksByIds, riskTypesByIds },
    global: { filter, urlItemId, collapsed },
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
      const selectedStatusItem = createRiskStatusItem(selectedRisk.status);
      const statusCollapseAction = addCollapsed(addClose(selectedStatusItem));

      return store.dispatch(statusCollapseAction);
    }
    case RiskFilterIndexes.DEPARTMENT: {
      const selectedDepartments = selectedRisk.departmentsIds.length
        ? selectedRisk.departmentsIds
        : [DEPARTMENT_UNCATEGORIZED];
      const includesKey = ({ key }) => includes(key, selectedDepartments);
      const selectedExpandedDepartments = filterC(every([
        includesKey,
        some([
          propEqType(CollectionNames.DEPARTMENTS),
          propEqType(DEPARTMENT_UNCATEGORIZED),
        ]),
      ]), collapsed);

      const close = ({ type }) => some([
        includesKey,
        compose(not, propEqType(type)),
      ]);

      const actions = mapC(item =>
        addCollapsed({ ...item, close: close(item) }),
        selectedExpandedDepartments
      );

      return store.dispatch(chainActions(actions));
    }
    default:
      return false;
  }
};

export const getSelectedRiskDeletedState = state => ({
  isSelectedRiskDeleted: getC(
    'isDeleted',
    state.collections.risksByIds[state.global.urlItemId]
  ),
});
