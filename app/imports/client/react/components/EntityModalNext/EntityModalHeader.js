import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';

import { ModalHeader } from '../Modal';
import EntityModalLeftHeaderButton from './EntityModalLeftHeaderButton';
import EntityModalRightHeaderButton from './EntityModalRightHeaderButton';

const EntityModalHeader = ({
  label,
  rightButtonLabel,
  children,
  ...props
}) => (
  <ModalHeader
    renderLeftButton={<EntityModalLeftHeaderButton />}
    renderRightButton={<EntityModalRightHeaderButton label={rightButtonLabel} />}
    {...props}
  >
    {children || label && (<CardTitle>{label}</CardTitle>)}
  </ModalHeader>
);

EntityModalHeader.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  rightButtonLabel: PropTypes.string,
};

export default EntityModalHeader;
