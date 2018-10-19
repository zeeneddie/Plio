import { graphql } from 'react-apollo';
import { withHandlers, flattenProp, lifecycle } from 'recompose';
import { getTargetValue, getValue, Cache } from 'plio-util';
import { mergeDeepLeft, compose, objOf, pluck, identity, always } from 'ramda';

import RiskSubcard from '../components/RiskSubcard';
import { namedCompose, withMutationState } from '../../helpers';
import { Mutation, Fragment } from '../../../graphql';
import { updateRiskFragment } from '../../../apollo/utils';
import { swal } from '../../../util';

const {
  UPDATE_RISK_TITLE,
  UPDATE_RISK_DESCRIPTION,
  UPDATE_RISK_STATUS_COMMENT,
  UPDATE_RISK_ORIGINATOR,
  UPDATE_RISK_OWNER,
  UPDATE_RISK_MAGNITUDE,
  LINK_RISK_TYPE_TO_RISK,
  UPDATE_RISK_STANDARDS,
  UPDATE_RISK_DEPARTMENTS,
  CREATE_DEPARTMENT,
  SET_RISK_ANALYSIS_TARGET_DATE,
  SET_RISK_ANALYSIS_EXECUTOR,
  COMPLETE_RISK_ANALYSIS,
  UNDO_RISK_ANALYSIS_COMPLETION,
  SET_RISK_ANALYSIS_COMPLETED_BY,
  SET_RISK_ANALYSIS_COMPLETED_AT,
  SET_RISK_ANALYSIS_COMPLETION_COMMENTS,
} = Mutation;

const createHandler = (getArgs, mutationName) => ({
  mutateWithState,
  [mutationName]: mutate,
  risk: { _id },
}) => (...args) => mutateWithState(mutate({
  variables: {
    input: {
      _id,
      ...getArgs(...args),
    },
  },
  update: (proxy, { data: { [mutationName]: { risk } } }) => updateRiskFragment(
    mergeDeepLeft(risk),
    {
      id: _id,
      fragment: Fragment.RISK_CARD,
    },
    proxy,
  ),
}));

export default namedCompose('RiskSubcardContainer')(
  graphql(UPDATE_RISK_TITLE, { name: UPDATE_RISK_TITLE.name }),
  graphql(UPDATE_RISK_DESCRIPTION, { name: UPDATE_RISK_DESCRIPTION.name }),
  graphql(UPDATE_RISK_STATUS_COMMENT, { name: UPDATE_RISK_STATUS_COMMENT.name }),
  graphql(UPDATE_RISK_ORIGINATOR, { name: UPDATE_RISK_ORIGINATOR.name }),
  graphql(UPDATE_RISK_OWNER, { name: UPDATE_RISK_OWNER.name }),
  graphql(UPDATE_RISK_MAGNITUDE, { name: UPDATE_RISK_MAGNITUDE.name }),
  graphql(LINK_RISK_TYPE_TO_RISK, { name: LINK_RISK_TYPE_TO_RISK.name }),
  graphql(UPDATE_RISK_STANDARDS, { name: UPDATE_RISK_STANDARDS.name }),
  graphql(UPDATE_RISK_DEPARTMENTS, { name: UPDATE_RISK_DEPARTMENTS.name }),
  graphql(CREATE_DEPARTMENT, { name: CREATE_DEPARTMENT.name }),
  graphql(SET_RISK_ANALYSIS_TARGET_DATE, { name: SET_RISK_ANALYSIS_TARGET_DATE.name }),
  graphql(SET_RISK_ANALYSIS_EXECUTOR, { name: SET_RISK_ANALYSIS_EXECUTOR.name }),
  graphql(COMPLETE_RISK_ANALYSIS, { name: COMPLETE_RISK_ANALYSIS.name }),
  graphql(UNDO_RISK_ANALYSIS_COMPLETION, { name: UNDO_RISK_ANALYSIS_COMPLETION.name }),
  graphql(SET_RISK_ANALYSIS_COMPLETED_BY, { name: SET_RISK_ANALYSIS_COMPLETED_BY.name }),
  graphql(SET_RISK_ANALYSIS_COMPLETED_AT, { name: SET_RISK_ANALYSIS_COMPLETED_AT.name }),
  graphql(SET_RISK_ANALYSIS_COMPLETION_COMMENTS, {
    name: SET_RISK_ANALYSIS_COMPLETION_COMMENTS.name,
  }),
  withMutationState(),
  withHandlers({
    onChangeTitle: createHandler(
      compose(objOf('title'), getTargetValue),
      UPDATE_RISK_TITLE.name,
    ),
    onChangeDescription: createHandler(
      compose(objOf('description'), getTargetValue),
      UPDATE_RISK_DESCRIPTION.name,
    ),
    onChangeStatusComment: createHandler(
      compose(objOf('statusComment'), getTargetValue),
      UPDATE_RISK_STATUS_COMMENT.name,
    ),
    onChangeOriginator: createHandler(
      compose(objOf('originatorId'), getValue),
      UPDATE_RISK_ORIGINATOR.name,
    ),
    onChangeOwner: createHandler(
      compose(objOf('ownerId'), getValue),
      UPDATE_RISK_OWNER.name,
    ),
    onChangeMagnitude: createHandler(
      compose(objOf('magnitude'), getTargetValue),
      UPDATE_RISK_MAGNITUDE.name,
    ),
    onChangeType: createHandler(
      compose(objOf('typeId'), getTargetValue),
      LINK_RISK_TYPE_TO_RISK.name,
    ),
    onChangeStandards: createHandler(
      compose(objOf('standardsIds'), pluck('value')),
      UPDATE_RISK_STANDARDS.name,
    ),
    onChangeDepartments: createHandler(
      compose(objOf('departmentsIds'), pluck('value')),
      UPDATE_RISK_DEPARTMENTS.name,
    ),
    onChangeTargetDate: createHandler(
      objOf('targetDate'),
      SET_RISK_ANALYSIS_TARGET_DATE.name,
    ),
    onChangeExecutor: createHandler(
      compose(objOf('executor'), getValue),
      SET_RISK_ANALYSIS_EXECUTOR.name,
    ),
    onChangeCompletedBy: createHandler(
      compose(objOf('completedBy'), getValue),
      SET_RISK_ANALYSIS_COMPLETED_BY.name,
    ),
    onChangeCompletedAt: createHandler(
      objOf('completedAt'),
      SET_RISK_ANALYSIS_COMPLETED_AT.name,
    ),
    onChangeCompletionComments: createHandler(
      compose(objOf('completionComments'), getTargetValue),
      SET_RISK_ANALYSIS_COMPLETION_COMMENTS.name,
    ),
    onComplete: createHandler(
      identity,
      COMPLETE_RISK_ANALYSIS.name,
    ),
    onUndoCompletion: createHandler(
      always({}),
      UNDO_RISK_ANALYSIS_COMPLETION.name,
    ),
  }),
  withHandlers({
    // TODO: don't pass if the user is not authorized for changing org settings
    onAddDepartment: ({
      [CREATE_DEPARTMENT.name]: createDepartment,
      onChangeDepartments,
      organizationId,
      risk: { _id, departments },
    }) => ({ value }) => swal.promise({
      title: 'Are you sure?',
      text: `New department/sector "${value}" will be added.`,
      confirmButtonText: 'Add',
      successTitle: 'Added!',
      successText: `New department/sector "${value}" was added successfully`,
    }, () => {
      const promise = createDepartment({
        variables: {
          input: {
            organizationId,
            name: value,
          },
        },
        update: (proxy, { data: { createDepartment: { department } } }) => updateRiskFragment(
          Cache.addDepartment(department),
          {
            id: _id,
            fragment: Fragment.RISK_CARD,
          },
        ),
      });
      const linkNewDepartmentToRisk = ({ data: { createDepartment: { department } } }) => {
        const newDepartments = [...departments, department].map(({ _id: departmentId }) => ({
          value: departmentId,
        }));
        return onChangeDepartments(newDepartments);
      };

      return promise.then(linkNewDepartmentToRisk);
    }),
  }),
  flattenProp('mutation'),
  lifecycle({
    componentWillReceiveProps({ error }) {
      if (error) this.props.reset();
    },
  }),
)(RiskSubcard);
