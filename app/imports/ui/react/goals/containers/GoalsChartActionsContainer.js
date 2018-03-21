import connectUI from 'redux-ui';
import { prop } from 'ramda';
import { graphql } from 'react-apollo';
import { compose, withHandlers, onlyUpdateForKeys, flattenProp, branch } from 'recompose';
import { Mutation } from '../../../../client/graphql';
import { onDelete, onComplete } from '../handlers';
import ChartActions from '../components/ChartActions';

const enhance = compose(
  connectUI(),
  flattenProp('goal'),
  onlyUpdateForKeys(['organizationId', '_id', 'title']),
  withHandlers({
    onEdit: ({ goal, updateUI, togglePopover }) => () => {
      togglePopover();
      updateUI({
        isEditModalOpen: true,
        activeGoal: goal._id,
      });
    },
  }),
  graphql(Mutation.COMPLETE_GOAL, {
    props: props => ({
      onComplete: () => {
        props.ownProps.togglePopover();
        onComplete(props);
      },
    }),
  }),
  branch(
    prop('canEditGoals'),
    graphql(Mutation.DELETE_GOAL, {
      props: props => ({
        onDelete: () => {
          props.ownProps.togglePopover();
          onDelete(props);
        },
      }),
    }),
  ),
);

export default enhance(ChartActions);
