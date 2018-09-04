import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { pick } from 'ramda';

import { changeTitle } from '../../../../api/organizations/methods';
import { Mutation } from '../../../graphql';
import { pickDeep, getId } from '../../../../api/helpers';
import store from '../../../store';
import Workspace from '../components/Workspace';
import initMainData from './loaders/initMainData';
import { composeWithTracker, swal } from '../../../util';
import { withApollo } from '../../helpers';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';

const enhance = compose(
  withApollo,
  withProps({ store }),
  connect(),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onSelectTitle: ({ organization }) => ({ label, value }, callback) =>
      changeTitle.call({
        fieldName: `${value}`.replace(/\(.*\)/, ''),
        fieldValue: label,
        organizationId: getId(organization),
      }, callback),
  }),
  graphql(Mutation.UPDATE_ORGANIZATION_WORKSPACE_DEFAULTS, {
    props: ({ mutate, ownProps: { organization } }) => ({
      changeWorkspaceDefaults: workspaceDefaults => mutate({
        variables: {
          input: {
            _id: getId(organization),
            ...workspaceDefaults,
          },
        },
      }).catch(swal.error),
    }),
  }),
  withProps(({ organization: { [WORKSPACE_DEFAULTS]: workspaceDefaults = {} } = {} }) => ({
    initialValues: pick([
      WorkspaceDefaultsTypes.DISPLAY_USERS,
      WorkspaceDefaultsTypes.DISPLAY_MESSAGES,
      WorkspaceDefaultsTypes.DISPLAY_ACTIONS,
    ], workspaceDefaults),
  })),
);

export default enhance(Workspace);
