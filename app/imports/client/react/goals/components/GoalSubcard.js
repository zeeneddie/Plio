import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { validateGoal } from '../../../validation';
import { EntityForm, EntityCard, CardBlock } from '../../components';
import GoalEditFrom from './GoalEditForm';

const GoalSubcard = ({
  goal,
  isOpen,
  toggle,
  onDelete,
  onSubmit,
  organizationId,
  initialValues,
}) => (
  <EntityForm
    {...{
      isOpen,
      toggle,
      onDelete,
      onSubmit,
      initialValues,
    }}
    label={(
      <Fragment>
        <strong>{goal.sequentialId}</strong>
        {' '}
        {goal.title}
      </Fragment>
    )}
    validate={validateGoal}
    component={EntityCard}
  >
    {({ handleSubmit }) => (
      <CardBlock>
        <GoalEditFrom
          {...{ ...goal, organizationId }}
          save={handleSubmit}
        />
      </CardBlock>
    )}
  </EntityForm>
);

GoalSubcard.propTypes = {
  goal: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default GoalSubcard;
