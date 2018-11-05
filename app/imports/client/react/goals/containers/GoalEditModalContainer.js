import PropTypes from 'prop-types';
import React from 'react';
import connectUI from 'redux-ui';
import { compose, pure } from 'recompose';

import GoalEditModal from '../components/GoalEditModal';
import GoalEditContainer from './GoalEditContainer';

const enhance = compose(
  pure,
  connectUI(),
);

const GoalEditModalContainer = ({
  ui: { activeGoal },
  organizationId,
  isOpen,
  toggle,
}) => activeGoal && (
  <GoalEditContainer
    {...{
      organizationId,
      isOpen,
      toggle,
    }}
    goalId={activeGoal}
    component={GoalEditModal}
  />
);

GoalEditModalContainer.propTypes = {
  ui: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default enhance(GoalEditModalContainer);
