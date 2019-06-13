import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import GoalEditContainer from './GoalEditContainer';

const GoalSubcardContainer = ({
  organizationId,
  goal,
  onUnlink,
  toggle,
  canEditGoals,
  ...props
}) => (
  <Mutation
    mutation={Mutations.DELETE_GOAL}
    refetchQueries={[
      Queries.DASHBOARD_GOALS.name,
      Queries.COMPLETED_DELETED_GOALS.name,
      Queries.GOAL_LIST.name,
    ]}
  >
    {deleteGoal => (
      <GoalEditContainer
        {...{
          ...props,
          organizationId,
          goal,
          toggle,
        }}
        onDelete={() => swal.withExtraAction({
          title: canEditGoals && 'Choose an action',
          text: canEditGoals ? `Do you wish to unlink the goal "${goal.title}" from the ` +
            'current document, or delete it completely?' :
            `The goal "${goal.title}" will be unlinked`,
          confirmButtonText: 'Delete',
          showConfirmButton: !!canEditGoals,
          successText: `The key goal "${goal.title}" was deleted successfully.`,
          extraButton: 'Unlink',
          extraHandler: () => onUnlink(goal._id),
          confirmHandler: () => deleteGoal({
            variables: {
              input: { _id: goal._id },
            },
          }).then(() => onUnlink(goal._id)),
        })}
      />
    )}
  </Mutation>
);

GoalSubcardContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  canEditGoals: PropTypes.bool,
  goal: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default GoalSubcardContainer;
