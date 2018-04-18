import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import MilestoneEditFormContainer from '../containers/MilestoneEditFormContainer';
import { EntityModal } from '../../components';
import NewMilestoneFormContainer from '../containers/NewMilestoneFormContainer';

const FORM_ID = 'milestone-form';

const MilestoneModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  milestone,
  ...props
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      showSubmitBtn: !milestone,
    }}
    title="Milestone"
    formTarget={FORM_ID}
  >
    {milestone ?
      <FinalForm
        initialValues={initialValues}
        onSubmit={() => null}
        render={() => (
          <MilestoneEditFormContainer {...{ ...props, milestone }} />
        )}
      />
    :
      <NewMilestoneFormContainer
        {...{
          ...props,
          milestone,
          formId: FORM_ID,
        }}
      />
    }
  </EntityModal>
);

MilestoneModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  milestone: PropTypes.object,
};

export default MilestoneModal;
