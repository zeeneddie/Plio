import { graphql } from 'react-apollo';
import { Cache, lenses, viewEq, getUserOptions, bySerialNumber } from 'plio-util';
import { FORM_ERROR } from 'final-form';
import { view, ifElse, sort } from 'ramda';
import { withHandlers, pure } from 'recompose';

import { RisksSubcard } from '../../risks';
import { Mutation, Fragment, Query } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { swal } from '../../../../client/util';
import { updateGoalFragment } from '../../../../client/apollo';
import { ProblemMagnitudes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';

export default namedCompose('GoalRisksSubcardContainer')(
  pure,
  graphql(Query.GOAL_RISKS_CARD, {
    options: ({ goalId, organizationId }) => ({
      variables: { _id: goalId, organizationId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        user,
        riskTypes: { riskTypes = [] } = {},
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            risks = [],
            organization: { rkGuidelines: guidelines } = {},
          },
        } = {},
      },
    }) => ({
      guidelines,
      user,
      riskTypes,
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
      initialValues: {
        active: 0,
        owner: getUserOptions(user),
        originator: getUserOptions(user),
        type: view(lenses.head._id, riskTypes),
        magnitude: ProblemMagnitudes.MAJOR,
      },
      risks: sort(bySerialNumber, risks),
    }),
  }),
  graphql(Mutation.LINK_RISK_TO_GOAL, {
    props: ({
      mutate,
      ownProps: {
        linkedTo,
      },
    }) => ({
      linkRiskToGoal: async (
        { risk: { value: riskId } = {} },
        {
          ownProps: { flush },
        },
      ) => {
        if (!riskId) return { [FORM_ERROR]: 'Risk is required' };

        try {
          const { data } = await mutate({
            variables: {
              input: {
                riskId,
                _id: linkedTo._id,
              },
            },
            update: (proxy, { data: { linkRiskToGoal: { risk } } }) => updateGoalFragment(
              Cache.addRisk(risk),
              {
                id: linkedTo._id,
                fragment: Fragment.GOAL_CARD,
              },
              proxy,
            ),
          });
          const { linkRiskToGoal: { risk } } = data;

          return flush(risk);
        } catch ({ message }) {
          return { [FORM_ERROR]: message };
        }
      },
    }),
  }),
  graphql(Mutation.CREATE_RISK, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        linkedTo,
      },
    }) => ({
      createRisk: async (
        {
          title,
          description,
          originator: { value: originatorId },
          owner: { value: ownerId },
          magnitude,
          type: typeId,
        },
        {
          ownProps: { flush },
        },
      ) => {
        if (!title) return { [FORM_ERROR]: 'Title is required' };

        try {
          const { data } = await mutate({
            variables: {
              input: {
                title,
                description,
                originatorId,
                ownerId,
                magnitude,
                typeId,
                organizationId,
                goalId: linkedTo._id,
              },
            },
            update: (proxy, { data: { createRisk: { risk } } }) => updateGoalFragment(
              Cache.addRisk(risk),
              {
                id: linkedTo._id,
                fragment: Fragment.GOAL_CARD,
              },
              proxy,
            ),
          });

          const { createRisk: { risk } } = data;

          return flush(risk);
        } catch ({ message }) {
          return { [FORM_ERROR]: message };
        }
      },
    }),
  }),
  withHandlers({
    onSave: ({ linkRiskToGoal, createRisk }) => ifElse(
      viewEq(0, lenses.active),
      createRisk,
      linkRiskToGoal,
    ),
  }),
  graphql(Mutation.DELETE_RISK, {
    props: ({
      mutate,
      ownProps: { linkedTo },
    }) => ({
      onDelete: (e, {
        entity: { _id, title },
      }) => swal.promise({
        text: `The risk "${title}" will be deleted`,
        confirmButtonText: 'Delete',
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteRiskById(_id), {
          id: linkedTo._id,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    }),
  }),
)(RisksSubcard);
