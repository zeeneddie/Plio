import PropTypes from 'prop-types';
import React from 'react';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
  defaultTo,
  mergeDeepRight,
  path,
  find,
  where,
  equals,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  lenses,
  noop,
  mapEntitiesToOptions,
  getValues,
  getEntityOptions,
} from 'plio-util';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { swal } from '../../../util';

const getRisk = pathOr({}, repeat('risk', 2));
const getInitialValues = compose(
  pick([
    'title',
    'description',
    'statusComment',
    'magnitude',
    'owner',
    'originator',
    'type',
    'standards',
    'analysis',
    'status',
    'categorize',
    'departments',
    'projects',
  ]),
  over(lenses.projects, compose(mapEntitiesToOptions, defaultTo([]))),
  over(lenses.departments, compose(mapEntitiesToOptions, defaultTo([]))),
  over(lenses.owner, getUserOptions),
  over(lenses.originator, getUserOptions),
  over(lenses.type, getEntityOptions),
  over(lenses.standards, compose(mapEntitiesToOptions, defaultTo([]))),
  over(lenses.analysis, compose(
    pick([
      'targetDate',
      'executor',
      'completedBy',
      'completionComments',
      'completedAt',
      'status',
      'isCompleted',
    ]),
    over(lenses.executor, compose(getUserOptions, defaultTo({}))),
    over(lenses.completedBy, compose(getUserOptions, defaultTo({}))),
  )),
);

const RiskEditContainer = ({
  risk: _risk = null,
  riskId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      risk: _risk,
      initialValues: unless(isNil, getInitialValues, _risk),
    }}
  >
    {({ state: { initialValues, risk }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.RISK_CARD}
            variables={{ _id: riskId, organizationId }}
            skip={!isOpen || !!_risk}
            onCompleted={data => setState({
              initialValues: getInitialValues(getRisk(data)),
              risk: getRisk(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_RISK}
            children={noop}
            onCompleted={({ updateRisk }) => setState({ risk: updateRisk })}
          />,
          <Mutation
            mutation={Mutations.DELETE_RISK}
            children={noop}
            refetchQueries={() => [
              { query: Queries.RISK_LIST, variables: { organizationId } },
              { query: Queries.CANVAS_PAGE, variables: { organizationId } },
            ]}
          />,
          <Mutation
            mutation={Mutations.COMPLETE_RISK_ANALYSIS}
            children={noop}
            onCompleted={({ completeRiskAnalysis }) => {
              const newRisk = mergeDeepRight(risk, completeRiskAnalysis);
              setState({ risk: newRisk, initialValues: getInitialValues(newRisk) });
            }}
          />,
          <Mutation
            mutation={Mutations.UNDO_RISK_ANALYSIS_COMPLETION}
            children={noop}
            onCompleted={({ undoRiskAnalysisCompletion }) => {
              const newRisk = mergeDeepRight(risk, undoRiskAnalysisCompletion);
              setState({ risk: newRisk, initialValues: getInitialValues(newRisk) });
            }}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { data, loading, error },
          updateRisk,
          deleteRisk,
          completeRiskAnalysis,
          undoRiskAnalysisCompletion,
        ]) => renderComponent({
          ...props,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          risk,
          loading,
          userId: path(['user', '_id'], data),
          guidelines: path(['organization', 'rkGuidelines'], data),
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(risk);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              description = '',
              statusComment = '',
              standards,
              departments,
              projects,
              originator: { value: originatorId },
              owner: { value: ownerId },
              type: { value: typeId },
              analysis: {
                executor: { value: executor },
                targetDate,
                completedBy: { value: completedBy },
                completedAt,
                completionComments = '',
                isCompleted,
              } = {},
            } = values;

            const isCompletedDiff = find(
              where({ path: equals(['analysis', 'isCompleted']) }),
              difference,
            );

            if (isCompletedDiff) {
              if (isCompleted) {
                return completeRiskAnalysis({
                  variables: {
                    input: {
                      _id: risk._id,
                      completionComments,
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }

              return undoRiskAnalysisCompletion({
                variables: {
                  input: {
                    _id: risk._id,
                  },
                },
              }).then(noop).catch((err) => {
                form.reset(currentValues);
                throw err;
              });
            }

            return updateRisk({
              variables: {
                input: {
                  _id: risk._id,
                  title,
                  description,
                  statusComment,
                  standardsIds: getValues(standards),
                  departmentsIds: getValues(departments),
                  projectIds: getValues(projects),
                  originatorId,
                  ownerId,
                  typeId,
                  analysis: {
                    executor,
                    targetDate,
                    completedBy,
                    completedAt,
                    completionComments,
                  },
                },
              },
            }).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => {
            if (onDelete) return onDelete();

            return swal.promise({
              text: `The risk "${risk.title}" will be deleted`,
              confirmButtonText: 'Delete',
            }, () => deleteRisk({
              variables: {
                input: { _id: risk._id },
              },
            })).then(toggle || noop);
          },
        })}
      </Composer>
    )}
  </WithState>
);

RiskEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  riskId: PropTypes.string,
  risk: PropTypes.object,
  fetchPolicy: PropTypes.string,
};

export default React.memo(RiskEditContainer);
