import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { Button } from 'reactstrap';

import { EntityModal, TextAlign, CardBlock } from '../../components';
import MilestoneEditFormContainer from '../containers/MilestoneEditFormContainer';
import NewMilestoneFormContainer from '../containers/NewMilestoneFormContainer';
import MilestoneNotifySubcardContainer from '../containers/MilestoneNotifySubcardContainer';

const FORM_ID = 'milestone-form';

const MilestoneModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  milestone,
  onDelete,
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
        subscription={{}}
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
    {!loading && milestone && (
      <MilestoneNotifySubcardContainer
        milestoneId={milestone._id}
        organizationId={props.organizationId}
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

MilestoneModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  milestone: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default MilestoneModal;
