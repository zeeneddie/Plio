import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { CardTitle, Button } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalProvider,
  ErrorSection,
  CardBlock,
  SaveButton,
  TextAlign,
  GuidanceIcon,
  GuidancePanel,
} from '../../components';
import GoalEditContainer from '../containers/GoalEditContainer';
import { GoalsHelp } from '../../../../api/help-messages';
import { WithToggle } from '../../helpers';

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
  guidanceText,
  activeGoal,
  canEditGoals,
}) => (
  <ModalProvider {...{ isOpen, toggle }}>
    <Modal {...{ onClosed }}>
      {modal => (
        <WithToggle>
          {guidance => (
            <Fragment>
              <ModalHeader
                renderLeftButton={(
                  <GuidanceIcon isOpen={guidance.isOpen} onClick={guidance.toggle} />
                )}
                renderRightButton={(
                  <SaveButton
                    onClick={toggle}
                    color="secondary"
                    isSaving={loading || modal.loading}
                  >
                    Close
                  </SaveButton>
                )}
              >
                <CardTitle>Key Goal</CardTitle>
              </ModalHeader>
              <ErrorSection errorText={modal.error} />
              <ModalBody>
                <GuidancePanel {...guidance}>
                  {guidanceText}
                </GuidancePanel>
                <div>
                  <GoalEditContainer
                    {...{ organizationId, canEditGoals }}
                    goalId={activeGoal}
                    handleMutation={modal.handleMutation}
                  />
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
            </Fragment>
          )}
        </WithToggle>
      )}
    </Modal>
  </ModalProvider>
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
};

export default enhance(GoalEditModal);
