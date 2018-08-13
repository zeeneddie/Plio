import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';

import { ModalHeader } from '../Modal';
import LeftHeaderButton from './LeftHeaderButton';
import RightHeaderButton from './RightHeaderButton';

const EntityModalHeader = ({
  isEditMode,
  isGuidanceOpen,
  toggleGuidance,
  toggle,
  loading,
  label,
  children,
  ...props
}) => (
  <ModalHeader
    renderLeftButton={(
      <LeftHeaderButton
        {...{
          isEditMode,
          toggle,
          isGuidanceOpen,
          toggleGuidance,
        }}
      />
    )}
    renderRightButton={(
      <RightHeaderButton
        {...{
          toggle,
          isEditMode,
          loading,
          label,
        }}
      />
    )}
    {...props}
  >
    {children || label && (<CardTitle>{label}</CardTitle>)}
  </ModalHeader>
);

EntityModalHeader.defaultProps = {
  isEditMode: false,
};

EntityModalHeader.propTypes = {
  isEditMode: PropTypes.bool,
  isGuidanceOpen: PropTypes.bool.isRequired,
  toggleGuidance: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.node,
};

export default EntityModalHeader;
