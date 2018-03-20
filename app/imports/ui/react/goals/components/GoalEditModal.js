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
  'goal',
  'organizationId',
  'loading',
  'error',
  'isGuidancePanelOpen',
  'guidance',
]);

export const GoalEditModal = ({
  isOpen,
  toggle,
  onClosed,
  goal,
  organizationId,
  onDelete,
  loading,
  isGuidancePanelOpen,
  toggleGuidancePanel,
  guidance = GoalsHelp.goal,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderLeftButton={() => (
        <GuidanceIcon isOpen={isGuidancePanelOpen} onClick={toggleGuidancePanel} />
      )}
      renderRightButton={props => (
        <SaveButton onClick={toggle} isSaving={loading || props.loading}>
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
        {goal && (
          <GoalEditContainer {...{ goal, organizationId }} />
        )}
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
  goal: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  guidance: PropTypes.node,
  isGuidancePanelOpen: PropTypes.bool,
  toggleGuidancePanel: PropTypes.func,
};

export default enhance(GoalEditModal);
