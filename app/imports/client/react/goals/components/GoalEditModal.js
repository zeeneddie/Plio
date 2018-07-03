import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Button } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
  Modal,
  ModalHeader,
  ModalBody,
  CardBlock,
  SaveButton,
  TextAlign,
  GuidanceIcon,
  GuidancePanel,
} from '../../components';
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
  onClosed,
  organizationId,
  onDelete,
  loading,
  isGuidancePanelOpen,
  toggleGuidancePanel,
  guidance = GoalsHelp.goal,
  activeGoal,
  canEditGoals,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderLeftButton={() => (
        <GuidanceIcon isOpen={isGuidancePanelOpen} onClick={toggleGuidancePanel} />
      )}
      renderRightButton={props => (
        <SaveButton
          onClick={toggle}
          isSaving={loading || props.loading}
          color="secondary"
        >
          Close
        </SaveButton>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <GuidancePanel
        isOpen={isGuidancePanelOpen}
        toggle={toggleGuidancePanel}
      >
        {guidance}
      </GuidancePanel>
      <div>
        <GoalEditContainer goalId={activeGoal} {...{ organizationId, canEditGoals }} />
        {onDelete && (
          <TextAlign center>
            <CardBlock>
              <Button onClick={onDelete}>
                Delete
              </Button>
            </CardBlock>
          </TextAlign>
        )}
      </div>
    </ModalBody>
  </Modal>
);

GoalEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  guidance: PropTypes.node,
  isGuidancePanelOpen: PropTypes.bool,
  toggleGuidancePanel: PropTypes.func,
  activeGoal: PropTypes.string,
  canEditGoals: PropTypes.bool,
};

export default enhance(GoalEditModal);
