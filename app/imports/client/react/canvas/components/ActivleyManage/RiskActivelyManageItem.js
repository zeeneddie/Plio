import React from 'react';
import PropTypes from 'prop-types';

import { RisksHelp } from '../../../../../api/help-messages';
import { EntityManagerItem } from '../../../components';
import NewRiskCard from '../../../risks/components/NewRiskCard';
import RiskAddContainer from '../../../risks/containers/RiskAddContainer';
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
    guidance={RisksHelp.risk}
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
