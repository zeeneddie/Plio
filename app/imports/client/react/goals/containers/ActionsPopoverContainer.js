import connectUI from 'redux-ui';
import { propEq } from 'ramda';
import { graphql } from 'react-apollo';
import { compose, withHandlers, onlyUpdateForKeys, branch, withProps } from 'recompose';
import { Mutation, Query } from '../../../graphql';
import { swal } from '../../../util';
import ChartActions from '../components/ChartActions';

const {
  COMPLETE_ACTION,
  UNLINK_DOC_FROM_ACTION,
} = Mutation;

const enhance = compose(
  connectUI(),
  onlyUpdateForKeys(['_id', 'title', 'goalId']),
  withProps({
    deleteLabel: 'Delete action',
    editLabel: 'Edit action',
  }),
  withHandlers({
    onEdit: ({
      _id,
      goalId,
      updateUI,
      togglePopover,
    }) => () => {
      togglePopover();
      updateUI({
        isActionModalOpen: true,
        activeAction: _id,
        activeGoal: goalId,
      });
    },
  }),
  graphql(UNLINK_DOC_FROM_ACTION, {
    props: ({
      mutate,
      ownProps: {
        _id,
        goalId,
        title,
        togglePopover,
      },
    }) => ({
      onDelete: () => {
        togglePopover();
        swal.promise({
          text: `The action "${title}" will be deleted from the goal`,
          confirmButtonText: 'Delete',
        }, () => mutate({
          variables: {
            input: {
              _id,
              documentId: goalId,
            },
          },
          refetchQueries: [
            Query.DASHBOARD_GOALS.name,
          ],
        }));
      },
    }),
  }),
  branch(
    propEq('isCompleted', false),
    graphql(COMPLETE_ACTION, {
      props: ({ mutate, ownProps: { _id, togglePopover } }) => ({
        onComplete: () => {
          togglePopover();
          mutate({
            variables: {
              input: { _id },
            },
            refetchQueries: [
              Query.DASHBOARD_GOALS.name,
            ],
          });
        },
      }),
    }),
  ),
);

export default enhance(ChartActions);
