import PropTypes from 'prop-types';
import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import { noop } from 'plio-util';

import { EntityModal } from '../../components';
import GoalEditContainer from '../containers/GoalEditContainer';
import { GoalsHelp } from '../../../../api/help-messages';

const enhance = onlyUpdateForKeys([
  'isOpen',
  'toggle',
  'organizationId',
  'loading',
  'error',
  'isGuidancePanelOpen',
  'guidance',
  'canEditGoals',
]);

export const GoalEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  guidanceText,
  activeGoal,
  canEditGoals,
  initialValues,
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      onDelete,
      initialValues,
    }}
    isEditMode
    title="Key Goal"
    onSave={noop}
    guidanceText={guidanceText}
  >
    {({ handleMutation }) => (
      <GoalEditContainer
        {...{ organizationId, canEditGoals, handleMutation }}
        goalId={activeGoal}
      />
    )}
  </EntityModal>
);

GoalEditModal.defaultProps = {
  guidanceText: GoalsHelp.goal,
};

GoalEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  guidanceText: PropTypes.node,
  activeGoal: PropTypes.string,
  canEditGoals: PropTypes.bool,
  initialValues: PropTypes.object,
};

export default enhance(GoalEditModal);
