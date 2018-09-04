import PropTypes from 'prop-types';
import { withHandlers, pure, setPropTypes } from 'recompose';
import { graphql } from 'react-apollo';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query, Mutation } from '../../../graphql';
import { namedCompose } from '../../helpers';
import { onSave } from '../handlers';

import MilestoneAddModal from '../components/MilestoneAddModal';

const { CREATE_MILESTONE } = Mutation;

export default namedCompose('MilestoneAddModalContainer')(
  setPropTypes({
    goalId: PropTypes.string.isRequired,
  }),
  pure,
  graphql(Query.DASHBOARD_GOAL, {
    options: ({ goalId }) => ({
      variables: { _id: goalId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            color,
          } = {},
        } = {},
      },
    }) => ({
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
      color,
    }),
  }),
  graphql(CREATE_MILESTONE, { name: CREATE_MILESTONE.name }),
  withHandlers({
    onSave: props => (...args) => onSave(props)(...args).then(props.toggle),
  }),
)(MilestoneAddModal);
