import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

import { EntityModal } from '../../components';
import MilestoneEditFormContainer from '../containers/MilestoneEditFormContainer';
import MilestoneNotifySubcardContainer from '../containers/MilestoneNotifySubcardContainer';

const MilestoneEditModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  onDelete,
  milestone,
  ...props
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      initialValues,
      onDelete,
    }}
    showSubmitBtn={false}
    title="Milestone"
    onSave={noop}
  >
    <MilestoneEditFormContainer {...{ ...props, milestone }} />

    {!loading && (
      <MilestoneNotifySubcardContainer
        milestoneId={milestone._id}
        organizationId={props.organizationId}
      />
    )}
  </EntityModal>
);

MilestoneEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  milestone: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default MilestoneEditModal;
