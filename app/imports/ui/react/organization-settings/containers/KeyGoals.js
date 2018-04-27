import { graphql } from 'react-apollo';
import {
  compose,
  flattenProp,
  onlyUpdateForKeys,
  defaultProps,
  mapProps,
} from 'recompose';
import { pick } from 'ramda';

import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { Mutation, Query } from '../../../../client/graphql';
import { swal } from '../../../../client/util';
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
  mapProps(({ _id, ...props }) => ({
    _id,
    initialValues: pick([
      WorkspaceDefaultsTypes.DISPLAY_GOALS,
      WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS,
      WorkspaceDefaultsTypes.TIME_SCALE,
    ], props),
  })),
  graphql(Mutation.UPDATE_ORGANIZATION_WORKSPACE_DEFAULTS, {
    props: ({ mutate, ownProps: { _id } }) => ({
      changeGoalsLimit: ({ value }) => mutate({
        variables: {
          input: {
            _id,
            [WorkspaceDefaultsTypes.DISPLAY_GOALS]: value,
          },
        },
        refetchQueries: [
          {
            query: Query.DASHBOARD_GOALS,
            variables: {
              organizationId: _id,
              limit: value,
            },
          },
        ],
      }).catch(swal.error),
      changeCompletedDeletedGoals: ({ value }) => mutate({
        variables: {
          input: {
            _id,
            [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: value,
          },
        },
        refetchQueries: [
          {
            query: Query.COMPLETED_DELETED_GOALS,
            variables: {
              organizationId: _id,
              limit: value,
            },
          },
        ],
      }).catch(swal.error),
      changeChartScale: ({ value }) => mutate({
        variables: {
          input: {
            _id,
            [WorkspaceDefaultsTypes.TIME_SCALE]: value,
          },
        },
      }).catch(swal.error),
    }),
  }),
);

export default enhance(KeyGoalsSettings);
