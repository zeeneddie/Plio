import { _ } from 'meteor/underscore';
import { withProps } from 'recompose';

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
