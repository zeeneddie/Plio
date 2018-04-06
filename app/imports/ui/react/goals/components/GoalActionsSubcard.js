import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { pick, compose, over } from 'ramda';
import { lenses, getUserOptions, mapEntitiesToOptions, renameKeys } from 'plio-util';

import ActionSubcardContainer from '../../actions/containers/ActionSubcardContainer';
import ActionsSubcard from '../../actions/components/ActionsSubcard';

const getInitialValues = compose(
  pick([
    'title',
    'description',
    'owner',
    'planInPlace',
    'completionTargetDate',
    'toBeCompletedBy',
    'completedAt',
    'completedBy',
    'verifiedAt',
    'verifiedBy',
    'completionComments',
    'verificationComments',
    'toBeVerifiedBy',
    'verificationTargetDate',
    'linkedTo',
  ]),
  renameKeys({ goals: 'linkedTo' }),
  over(lenses.goals, mapEntitiesToOptions),
  over(lenses.toBeVerifiedBy, getUserOptions),
  over(lenses.verifiedBy, getUserOptions),
  over(lenses.completedBy, getUserOptions),
  over(lenses.toBeCompletedBy, getUserOptions),
  over(lenses.owner, getUserOptions),
);

const GoalActionsSubcard = ({
  onDelete,
  userId,
  canCompleteAnyAction,
  loadLinkedDocs,
  ...props
}) => (
  <ActionsSubcard
    {...props}
    render={({ entity, isOpen, toggle }) => (
      <Form
        key={entity._id}
        onSubmit={() => null}
        subscription={{}}
        initialValues={getInitialValues(entity)}
        render={() => (
          <ActionSubcardContainer
            action={entity}
            {...{
              ...props,
              loadLinkedDocs,
              userId,
              canCompleteAnyAction,
              isOpen,
              toggle,
              onDelete,
            }}
          />
        )}
      />
    )}
  />
);

GoalActionsSubcard.propTypes = {
  onDelete: PropTypes.func,
  userId: PropTypes.string.isRequired,
  canCompleteAnyAction: PropTypes.bool,
  organizationId: PropTypes.string.isRequired,
  loadLinkedDocs: PropTypes.func,
};

export default GoalActionsSubcard;
