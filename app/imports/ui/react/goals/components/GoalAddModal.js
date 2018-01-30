import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  CardBlock,
} from '../../components';
import GoalFormContainer from '../containers/GoalFormContainer';

export const GoalAddModal = ({
  isOpen,
  toggle,
  errorText,
  onSubmit,
  organizationId,
}) => (
  <Modal {...{ isOpen, toggle }}>
    <ModalHeader
      renderLeftButton={() => <Button onClick={toggle}>Close</Button>}
      renderRightButton={() => (
        <Button color="primary" onClick={onSubmit}>
          Save
        </Button>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <ErrorSection {...{ errorText }} />

      <div>
        <CardBlock>
          <GoalFormContainer {...{ organizationId }} />
        </CardBlock>
      </div>
    </ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  errorText: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
};

export default GoalAddModal;
