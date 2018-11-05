import React from 'react';
import PropTypes from 'prop-types';

import { RisksSubcard, RiskAddContainer } from '../../risks';

const CanvasRisksSubcard = ({
  organizationId,
  risks,
  guidelines,
  linkedTo,
  onLink,
  onUnlink,
}) => (
  <RiskAddContainer
    {...{
      organizationId,
      risks,
      guidelines,
      linkedTo,
      onLink,
      onUnlink,
    }}
    render={({ onSubmit, ...restRiskProps }) => (
      <RisksSubcard
        {...restRiskProps}
        onSave={onSubmit}
      />
    )}
  />
);


CanvasRisksSubcard.propTypes = {
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  risks: PropTypes.arrayOf(PropTypes.object),
  guidelines: PropTypes.object,
};

export default CanvasRisksSubcard;
