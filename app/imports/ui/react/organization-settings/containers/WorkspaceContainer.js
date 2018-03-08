import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { changeTitle } from '../../../../api/organizations/methods';
import { Mutation } from '../../../../client/graphql';
import { pickDeep, getId } from '../../../../api/helpers';
import store from '../../../../client/store';
import Workspace from '../components/Workspace';
import initMainData from './loaders/initMainData';
import { composeWithTracker } from '../../../../client/util';
import { withApollo } from '../../helpers';


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
      }),
    }),
  }),
);

export default enhance(Workspace);
