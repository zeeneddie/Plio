import { graphql } from 'react-apollo';
import {
  compose,
  flattenProp,
  onlyUpdateForKeys,
  defaultProps,
} from 'recompose';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { Mutation, Query } from '../../../../client/graphql';
import { withApollo } from '../../helpers';
import KeyGoalsSettings from '../components/KeyGoals';

const getWorkspaceDefaultsVariables = (_id, workspaceDefaults) => ({
  input: {
    _id,
    ...workspaceDefaults,
  },
});

const enhance = compose(
  withApollo,
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  onlyUpdateForKeys([
    '_id',
    WorkspaceDefaultsTypes.DISPLAY_GOALS,
    WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS,
    WorkspaceDefaultsTypes.TIME_SCALE,
  ]),
  defaultProps({
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]:
      WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]:
      WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS],
    [WorkspaceDefaultsTypes.TIME_SCALE]:
      WorkspaceDefaults[WorkspaceDefaultsTypes.TIME_SCALE],
  }),
  graphql(Mutation.UPDATE_ORGANIZATION_WORKSPACE_DEFAULTS, {
    props: ({ mutate, ownProps: { _id } }) => ({
      changeGoalsLimit: workspaceDefaults => mutate({
        variables: getWorkspaceDefaultsVariables(_id, workspaceDefaults),
        refetchQueries: [
          {
            query: Query.DASHBOARD_GOALS,
            variables: {
              organizationId: _id,
              limit: workspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
            },
          },
        ],
      }),
      changeCompletedDeletedGoals: workspaceDefaults => mutate({
        variables: getWorkspaceDefaultsVariables(_id, workspaceDefaults),
        refetchQueries: [
          {
            query: Query.COMPLETED_DELETED_GOALS,
            variables: {
              organizationId: _id,
              limit: workspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS],
            },
          },
        ],
      }),
      changeChartScale: workspaceDefaults => mutate({
        variables: getWorkspaceDefaultsVariables(_id, workspaceDefaults),
      }),
    }),
  }),
);

export default enhance(KeyGoalsSettings);
