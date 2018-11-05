import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewRiskCard, RiskAddContainer } from '../../../risks';
import ActivelyManageItem from './ActivelyManageItem';

const RiskActivelyManageItem = ({
  organizationId,
  onLink,
  onUnlink,
  guidelines,
  linkedTo,
}) => (
  <EntityManagerItem
    {...{ organizationId, onLink, onUnlink }}
    itemId="risk"
    label="Risk"
    component={RiskAddContainer}
    render={ActivelyManageItem}
  >
    <NewRiskCard {...{ organizationId, guidelines, linkedTo }} />
  </EntityManagerItem>
);

RiskActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  guidelines: PropTypes.object,
};

export default RiskActivelyManageItem;
