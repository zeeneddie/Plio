import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { Button } from 'reactstrap';

import { EntityModal, TextAlign, CardBlock } from '../../components';
import GeneralActionEditFormContainer from '../containers/GeneralActionEditFormContainer';
import NewGeneralActionFormContainer from '../containers/NewGeneralActionFormContainer';

const FORM_ID = 'general-action-form';

const GeneralActionModal = ({
  action,
  isOpen,
  toggle,
  loading,
  initialValues,
  onDelete,
  ...props
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      showSubmitBtn: !action,
    }}
    title="Action"
    formTarget={FORM_ID}
  >
    {action ? (
      <FinalForm
        initialValues={initialValues}
        onSubmit={() => null}
        subscription={{}}
        render={() => (
          <GeneralActionEditFormContainer {...{ ...props, ...action }} />
        )}
      />
    ) : (
      <NewGeneralActionFormContainer
        {...{
          ...props,
          action,
          formId: FORM_ID,
        }}
      />
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
  </EntityModal>
);

GeneralActionModal.propTypes = {
  action: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default GeneralActionModal;
