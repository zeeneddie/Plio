import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Button, Form } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { withHandlers } from 'recompose';

import {
  Modal,
  ModalHeader,
  ModalBody,
  SaveButton,
  TextAlign,
  CardBlock,
  ErrorSection,
} from './';
import { handleGQError } from '../../../api/handleGQError';

const enhance = withHandlers({
  onSave: ({ onSave }) => async (...args) => {
    try {
      return await onSave(...args);
    } catch (err) {
      return { [FORM_ERROR]: handleGQError(err) };
    }
  },
});

const EntityModal = ({
  isOpen,
  toggle,
  loading,
  children,
  title,
  showSubmitBtn,
  onSave,
  initialValues,
  onDelete,
}) => (
  <FinalForm
    {...{ initialValues }}
    onSubmit={onSave}
    subscription={{
      submitError: true,
      submitting: true,
      initialValues: true,
    }}
  >
    {({
      handleSubmit,
      submitting,
      submitError,
    }) => (
      <Form onSubmit={handleSubmit} id={title}>
        <Modal {...{ isOpen, toggle }}>
          <ModalHeader
            renderLeftButton={() => showSubmitBtn ? <Button onClick={toggle}>Close</Button> : null}
            renderRightButton={props => (
              <SaveButton
                isSaving={loading || submitting || props.loading}
                onClick={!showSubmitBtn ? toggle : undefined}
                color={showSubmitBtn ? 'primary' : 'secondary'}
                type="submit"
                form={title}
              >
                {showSubmitBtn ? 'Save' : 'Close'}
              </SaveButton>
            )}
          >
            <CardTitle>{title}</CardTitle>
          </ModalHeader>
          <ModalBody
            renderErrorSection={({ error }) => (
              <ErrorSection errorText={submitError || error} />
            )}
          >
            {children}
            {onDelete && (
              <TextAlign center>
                <CardBlock>
                  <Button onClick={onDelete}>
                    Delete
                  </Button>
                </CardBlock>
              </TextAlign>
            )}
          </ModalBody>
        </Modal>
      </Form>
    )}
  </FinalForm>
);

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  showSubmitBtn: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default enhance(EntityModal);
