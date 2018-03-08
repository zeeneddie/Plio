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
import { Mutation } from '../../../../client/graphql';
import { withApollo } from '../../helpers';
import KeyGoalsSettings from '../components/KeyGoals';

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
      changeWorkspaceDefaults: workspaceDefaults => mutate({
        variables: {
          input: {
            _id,
            ...workspaceDefaults,
          },
        },
      }),
    }),
  }),
);

export default enhance(KeyGoalsSettings);
