import connectUI from 'redux-ui';
import { graphql } from 'react-apollo';
import { compose, withHandlers, onlyUpdateForKeys, flattenProp } from 'recompose';
import { withStore } from '../../helpers';
import { Mutation } from '../../../../client/graphql';
import { onDelete, onComplete } from '../handlers';
import GoalsChartActionsList from '../components/GoalsChartActionsList';

const enhance = compose(
  withStore,
  connectUI(),
  flattenProp('goal'),
  onlyUpdateForKeys(['organizationId', '_id', 'title']),
  withHandlers({
    onEdit: ({ _id, updateUI, togglePopover }) => () => {
      togglePopover();
      updateUI({
        isEditModalOpen: true,
        activeGoal: _id,
      });
    },
  }),
  graphql(Mutation.DELETE_GOAL, {
    props: props => ({
      onDelete: () => {
        props.ownProps.togglePopover();
        onDelete(props);
      },
    }),
  }),
  graphql(Mutation.COMPLETE_GOAL, {
    props: props => ({
      onComplete: () => {
        props.ownProps.togglePopover();
        onComplete(props);
      },
    }),
  }),
);

export default enhance(GoalsChartActionsList);
