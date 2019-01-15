import React from 'react';
import PropTypes from 'prop-types';

import ActionAddContainer from './ActionAddContainer';
import ActionEditContainer from './ActionEditContainer';
import ActionAddModal from '../components/ActionAddModal';
import ActionEditModal from '../components/ActionEditModal';

const ActionModalContainer = ({
  isOpen,
  toggle,
  organizationId,
  refetchQueries,
  type,
  linkedTo,
  actionId,
  actionIds,
  linkedToField,
  canCompleteAnyAction,
  userId,
}) => {
  if (!actionId) {
    return (
      <ActionAddContainer
        {...{
          isOpen,
          toggle,
          organizationId,
          refetchQueries,
          type,
          linkedTo,
          actionIds,
          linkedToField,
        }}
        render={ActionAddModal}
      />
    );
  }

  return (
    <ActionEditContainer
      {...{
        isOpen,
        toggle,
        organizationId,
        actionId,
        refetchQueries,
        type,
        linkedToField,
        canCompleteAnyAction,
        userId,
      }}
      render={ActionEditModal}
    />
  );
};

ActionModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  actionIds: PropTypes.array,
  refetchQueries: PropTypes.func,
  linkedTo: PropTypes.object,
  linkedToField: PropTypes.object,
  actionId: PropTypes.string,
  canCompleteAnyAction: PropTypes.bool,
  userId: PropTypes.string,
};

export default ActionModalContainer;
