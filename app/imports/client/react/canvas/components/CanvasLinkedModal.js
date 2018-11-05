import PropTypes from 'prop-types';
import React from 'react';

import { DocumentTypes } from '../../../../share/constants';
import GoalEditContainer from '../../goals/containers/GoalEditContainer';
import GoalEditModal from '../../goals/components/GoalEditModal';
import StandardEditContainer from '../../standards/containers/StandardEditContainer';
import StandardEditModal from '../../standards/components/StandardEditModal';

const CanvasLinkedModal = ({
  isOpen,
  toggle,
  documentType,
  documentId,
  organizationId,
}) => {
  switch (documentType) {
    case DocumentTypes.GOAL:
      return (
        <GoalEditContainer
          {...{ organizationId, isOpen, toggle }}
          component={GoalEditModal}
          goalId={documentId}
        />
      );
    case DocumentTypes.STANDARD:
      return (
        <StandardEditContainer
          {...{ organizationId, isOpen, toggle }}
          component={StandardEditModal}
          standardId={documentId}
        />
      );
    default:
      return null;
  }
};

CanvasLinkedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  documentType: PropTypes.string,
  documentId: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
};

export default CanvasLinkedModal;
