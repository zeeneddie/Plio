import { withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { mapRejectedEntitiesToOptions, Cache } from 'plio-util';
import { last, mergeDeepLeft } from 'ramda';

import {
  client,
  deleteActionFromGoalFragment,
  addActionToGoalFragment,
} from '../../../apollo';
import { namedCompose } from '../../helpers';
import { Query, Mutation, Fragment } from '../../../graphql';
import { DocumentTypes } from '../../../../share/constants';
import { updateActionFragment } from '../../../apollo/utils';
import ActionEditFormContainer from './ActionEditFormContainer';

const {
  LINK_DOC_TO_ACTION,
  UNLINK_DOC_FROM_ACTION,
} = Mutation;

export default namedCompose('GeneralActionEditFormContainer')(
  graphql(LINK_DOC_TO_ACTION, { name: LINK_DOC_TO_ACTION.name }),
  graphql(UNLINK_DOC_FROM_ACTION, { name: UNLINK_DOC_FROM_ACTION.name }),
  withHandlers({
    loadLinkedDocs: ({ organizationId, goals: actionGoals }) => () => client.query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    }).then(({ data: { goals: { goals } } }) => ({
      options: mapRejectedEntitiesToOptions(actionGoals, goals),
    })),
    onLink: ({ [LINK_DOC_TO_ACTION.name]: mutate, _id, goals }) =>
      async (options) => {
        if (options.length > goals.length) {
          const goalId = last(options).value;
          mutate({
            variables: {
              input: {
                _id,
                documentId: goalId,
                documentType: DocumentTypes.GOAL,
              },
            },
            update: (proxy, { data: { [LINK_DOC_TO_ACTION.name]: { action } } }) => {
              updateActionFragment(
                mergeDeepLeft(action),
                {
                  id: _id,
                  fragment: Fragment.ACTION_CARD,
                },
                proxy,
              );
              addActionToGoalFragment(goalId, action, proxy);
            },
          });
        }
      },
    onUnlink: ({ [UNLINK_DOC_FROM_ACTION.name]: mutate, _id }) =>
      async ({ value: goalId }) => mutate({
        variables: {
          input: {
            _id,
            documentId: goalId,
          },
        },
        update: (proxy) => {
          updateActionFragment(
            Cache.deleteGoal(goalId),
            {
              id: _id,
              fragment: Fragment.ACTION_CARD,
            },
            proxy,
          );
          deleteActionFromGoalFragment(goalId, _id, proxy);
        },
      }),
  }),
)(ActionEditFormContainer);
