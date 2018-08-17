import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { ModalBody, CardTitle, Button, Form } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';
import ErrorSection from '../../components/ErrorSection';

import {
  Modal,
  ModalHeader,
  CardBlock,
  SaveButton,
} from '../../components';
import GoalForm from './GoalForm';

export const GoalAddModal = ({
  isOpen,
  toggle,
  onSubmit,
  organizationId,
  onClosed,
  ...props
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <FinalForm
      {...{ onSubmit, ...props }}
      subscription={{ submitError: true, submitting: true }}
    >
      {({ handleSubmit, submitError, submitting }) => (
        <Fragment>
          <ModalHeader
            renderLeftButton={() => <Button onClick={toggle}>Close</Button>}
            renderRightButton={({ loading }) => (
              <SaveButton onClick={handleSubmit} isSaving={submitting || loading} />
            )}
          >
            <CardTitle>Key Goal</CardTitle>
          </ModalHeader>

          <ErrorSection errorText={submitError} />

          <ModalBody>
            <CardBlock>
              <Form onSubmit={handleSubmit}>
                <GoalForm {...{ organizationId }} />
              </Form>
            </CardBlock>
          </ModalBody>
        </Fragment>
      )}
    </FinalForm>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onClosed: PropTypes.func,
};

export default GoalAddModal;
