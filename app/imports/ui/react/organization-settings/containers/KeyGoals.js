import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  flattenProp,
  onlyUpdateForKeys,
  defaultProps,
} from 'recompose';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '/imports/share/constants';
import { Mutation } from '/imports/client/graphql';
import { pickDeep } from '/imports/api/helpers';
import store from '/imports/client/store';
import { withApollo } from '../../helpers';
import { composeWithTracker } from '../../../../client/util';
import KeyGoalsSettings from '../components/KeyGoals';
import initMainData from './loaders/initMainData';

const enhance = compose(
  withApollo,
  withProps({ store }),
  connect(),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  onlyUpdateForKeys([
    '_id',
    WorkspaceDefaultsTypes.DISPLAY_GOALS,
    WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS,
  ]),
  defaultProps({
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]:
      WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]:
      WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS],
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
