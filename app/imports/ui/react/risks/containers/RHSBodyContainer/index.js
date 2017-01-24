import { _ } from 'meteor/underscore';
import moment from 'moment-timezone';
import curry from 'lodash.curry';
import { connect } from 'react-redux';
import { pickDeep } from '/imports/api/helpers';
import { capitalize } from '/imports/share/helpers';
import { getNameByScore, getClassByScore } from '/imports/api/risks/helpers';
import { getClassByStatus } from '/imports/api/work-items/helpers.js';

import BodyContents from '../../components/RHS/Body';

const pickDocument = curry((collection, fields, id) => pickDeep(fields, collection[id]));

const pickDocuments = curry((collection, fields, ids) => (
  ids ? ids.map(relatedId => pickDocument(collection, fields, relatedId)) : []
));

const mapStateToProps = ((state, { risk, actions }) => {
  const { usersByIds, departmentsByIds, standardsByIds, riskTypesByIds } = state.collections;

  const userPickArgs = [usersByIds, ['_id', 'profile.firstName', 'profile.lastName']];
  const pickUserById = pickDocument(...userPickArgs);
  const pickUsersById = pickDocuments(...userPickArgs);

  const actionsWithClasses = actions.map(action => ({
    ...action,
    className: getClassByStatus(action.status),
  }));

  return ({
    ...risk,
    preventativeActions: _.where(actionsWithClasses, { type: 'PA' }),
    correctiveActions: _.where(actionsWithClasses, { type: 'CA' }),
    orgSerialNumber: state.organizations.orgSerialNumber,
    type: riskTypesByIds[risk.typeId],
    magnitude: risk.magnitude && capitalize(risk.magnitude),
    scores: risk.scores.map(score => ({
      ...score,
      scoreTypeId: score.scoreTypeId && capitalize(score.scoreTypeId),
      scoredBy: pickUserById(score.scoredBy),
      scoredAt: moment(risk.identifiedAt).format('DD MMM YYYY'),
      priority: getNameByScore(score.value),
      className: getClassByScore(score.value),
    })),
    identifiedBy: pickUserById(risk.identifiedBy),
    identifiedAt: moment(risk.identifiedAt).format('DD MMM YYYY'),
    notify: pickUsersById(risk.notify),
    departments: pickDocuments(
      departmentsByIds,
      ['_id', 'name'],
      risk.departmentsIds
    ),
    standards: pickDocuments(
      standardsByIds,
      ['_id', 'title'],
      risk.standardsIds
    ),
  });
});

export default connect(mapStateToProps)(BodyContents);
