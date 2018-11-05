import React from 'react';
import PropTypes from 'prop-types';

import { ProblemTypes } from '../../../../../share/constants';
import { EntityManagerItem } from '../../../components';
import NonconformityAddContainer from
  '../../../noncomformities/containers/NonconformityAddContainer';
import NewPotantialGainCard from '../../../noncomformities/components/NewPotentialGainCard';
import ActivelyManageItem from './ActivelyManageItem';

const PotentialGainActivelyManageItem = ({ organizationId, onLink, guidelines }) => (
  <EntityManagerItem
    {...{ organizationId, onLink }}
    itemId="potentialGain"
    label="Potential gain"
    type={ProblemTypes.POTENTIAL_GAIN}
    component={NonconformityAddContainer}
    render={ActivelyManageItem}
  >
    <NewPotantialGainCard {...{ organizationId, guidelines }} />
  </EntityManagerItem>
);

PotentialGainActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  guidelines: PropTypes.object,
};

export default PotentialGainActivelyManageItem;
