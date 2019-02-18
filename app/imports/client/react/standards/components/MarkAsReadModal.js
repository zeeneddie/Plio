import PropTypes from 'prop-types';
import React, { memo, Fragment } from 'react';
import { CardTitle } from 'reactstrap';
import styled from 'styled-components';

import {
  CardBlock,
  EntityModalNext,
  EntityModalForm,
  EntityModalHeader,
  EntityModalBody,
  SaveButton,
} from '../../components';

const StyledCardBlock = styled(CardBlock)`
  display: flex;
  align-items: center;
  & > Button {
    margin-left: auto;
  }
`;

const MarkAsReadModal = memo(({
  isOpen,
  toggle,
  onSubmit,
  initialValues,
}) => (
  <EntityModalNext {...{ isOpen, toggle }}>
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      subscription={{ submitting: true }}
    >
      {({ handleSubmit, submitting }) => (
        <Fragment>
          <EntityModalHeader>
            <CardTitle>Mark as read</CardTitle>
          </EntityModalHeader>
          <EntityModalBody>
            <StyledCardBlock>
              I have read this document
              <SaveButton color="success" isSaving={submitting} onClick={handleSubmit}>
                Confirm
              </SaveButton>
            </StyledCardBlock>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
));

MarkAsReadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default MarkAsReadModal;
