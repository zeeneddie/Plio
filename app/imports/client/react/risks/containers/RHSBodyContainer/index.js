import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import property from 'lodash.property';
import set from 'lodash.set';

import {
  pickDocuments,
  mapC,
  transsoc,
  propValue,
  every,
  notDeleted,
  propEq,
  find,
  filterC,
  getC,
} from '/imports/api/helpers';
import { capitalize, getFormattedDate } from '/imports/share/helpers';
import { getNameByScore, getClassByScore } from '/imports/api/risks/helpers';
import {
  getLinkedActions,
  getLinkedLessons,
} from '/imports/client/react/share/helpers/linked';
import { DocumentTypes, ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/api/actions/helpers';
import { getPath } from '/imports/ui/utils/router';

import BodyContents from '../../components/RHS/Body';
import { getUserId, getUrlItemId } from '../../../../store/selectors/global';
import { getOrgSerialNumber } from '../../../../store/selectors/organizations';
import { getUsersByIds } from '../../../../store/selectors/users';
import { getDepartmentsByIds } from '../../../../store/selectors/departments';
import { getStandardsByIds } from '../../../../store/selectors/standards';
import { getRiskTypesByIds } from '../../../../store/selectors/riskTypes';
import { getWorkItems } from '../../../../store/selectors/workItems';
import { getLessons } from '../../../../store/selectors/lessons';
import { getActions } from '../../../../store/selectors/actions';

const mapStateToProps = state => ({
  userId: getUserId(state),
  urlItemId: getUrlItemId(state),
  orgSerialNumber: getOrgSerialNumber(state),
  usersByIds: getUsersByIds(state),
  departmentsByIds: getDepartmentsByIds(state),
  standardsByIds: getStandardsByIds(state),
  riskTypesByIds: getRiskTypesByIds(state),
  workItems: getWorkItems(state),
  lessons: getLessons(state),
  actions: getActions(state),
});

const propsMapper = ({
  risk,
  usersByIds,
  riskTypesByIds,
  departmentsByIds,
  standardsByIds,
  ...props
}) => {
  const pickUsers = pickDocuments(['_id', 'profile', 'emails'], usersByIds);
  const predicate = every([
    notDeleted,
    compose(
      find(propEq('documentId', risk._id)),
      property('linkedTo'),
    ),
  ]);
  const linkedActions = getLinkedActions(predicate, props, props.actions);
  const actionsByType = splitActionsByType(linkedActions);
  const preventativeActions = actionsByType[ActionTypes.PREVENTATIVE_ACTION];
  const correctiveActions = actionsByType[ActionTypes.CORRECTIVE_ACTION];
  const type = riskTypesByIds[risk.typeId];
  const lessons = getLinkedLessons(risk._id, DocumentTypes.RISK, props.lessons);
  const magnitude = risk.magnitude && capitalize(risk.magnitude);
  const scores = mapC(transsoc({
    scoreTypeId: compose(capitalize, property('scoreTypeId')),
    scoredBy: compose(pickUsers, property('scoredBy')),
    scoredAt: compose(getFormattedDate, property('scoredAt')),
    priority: compose(getNameByScore, propValue),
    className: compose(getClassByScore, propValue),
    value: propValue,
  }), risk.scores);
  const departments = pickDocuments(['_id', 'name'], departmentsByIds, risk.departmentsIds);
  const standards = compose(
    mapC(s => ({ ...s, href: getPath('standard')({ urlItemId: s._id }) })),
    filterC(notDeleted),
    pickDocuments(['_id', 'title'], standardsByIds),
  )(risk.standardsIds);

  const setUsers = () => [
    'originatorId',
    'ownerId',
    'notify',
    'improvementPlan.owner',
    'analysis.executor',
    'analysis.completedBy',
    'updateOfStandards.executor',
    'updateOfStandards.completedBy',
  ].map(path => set(risk, path, pickUsers(getC(path, risk))));

  setUsers();

  return {
    ...props,
    ...risk,
    type,
    preventativeActions,
    correctiveActions,
    magnitude,
    scores,
    departments,
    standards,
    lessons,
  };
};

export default compose(
  connect(mapStateToProps),
  mapProps(propsMapper),
)(BodyContents);
