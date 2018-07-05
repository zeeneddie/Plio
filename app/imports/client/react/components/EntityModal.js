import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Button, Form } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { withHandlers } from 'recompose';
import { is } from 'ramda';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalProvider,
  SaveButton,
  TextAlign,
  CardBlock,
  ErrorSection,
} from '../components';
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
  isEditMode,
  onSave,
  initialValues,
  onDelete,
  resetFormStateOnError,
}) => (
  <FinalForm
    {...{ initialValues }}
    onSubmit={onSave}
    subscription={{
      submitError: true,
      submitting: true,
      initialValues: true,
      active: true,
      dirty: true,
    }}
  >
    {({
      handleSubmit,
      submitting,
      submitError,
      active,
      dirty,
      form,
    }) => (
      <Form onSubmit={handleSubmit} id={title}>
        <ModalProvider
          {...{ isOpen, toggle }}
          onError={() => resetFormStateOnError ? form.reset() : null}
        >
          <Modal>
            {modal => (
              <Fragment>
                <ModalHeader
                  renderLeftButton={isEditMode ? null : <Button onClick={toggle}>Close</Button>}
                  renderRightButton={(
                    <SaveButton
                      isSaving={loading || modal.loading || submitting}
                      color={isEditMode ? 'secondary' : 'primary'}
                      type="submit"
                      form={title}
                      onMouseDown={() => {
                        // display saving state when clicking on "Close" button
                        // while being focused on the input
                        if (isEditMode) {
                          if (active && dirty) {
                            setTimeout(toggle, 200);
                          } else {
                            toggle();
                          }
                        }
                      }}
                    >
                      {isEditMode ? 'Close' : 'Save'}
                    </SaveButton>
                  )}
                >
                  <CardTitle>{title}</CardTitle>
                </ModalHeader>
                <ErrorSection errorText={submitError || modal.error} />
                <ModalBody>
                  {is(Function, children) ? children({ ...modal, form }) : children}
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
              </Fragment>
            )}
          </Modal>
        </ModalProvider>
      </Form>
    )}
  </FinalForm>
);

EntityModal.defaultProps = {
  resetFormStateOnError: true,
};

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  isEditMode: PropTypes.bool,
  resetFormStateOnError: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default enhance(EntityModal);
