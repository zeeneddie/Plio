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
  <Mutation mutation={Mutations.DELETE_GOAL}>
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
          extraHandler: () => onUnlink(goal._id).then(toggle),
          confirmHandler: () => deleteGoal({
            variables: {
              input: { _id: goal._id },
            },
            refetchQueries: [{
              query: Queries.GOAL_LIST,
              variables: { organizationId },
            }],
          }).then(() => onUnlink(goal._id)).then(toggle),
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
