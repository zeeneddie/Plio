import React from 'react';
import PropTypes from 'prop-types';

import { NonConformitiesHelp } from '../../../../../api/help-messages';
import { ProblemTypes } from '../../../../../share/constants';
import { EntityManagerItem } from '../../../components';
import NonconformityAddContainer from
  '../../../noncomformities/containers/NonconformityAddContainer';
import NewNonconformityCard from '../../../noncomformities/components/NewNonconformityCard';
import ActivelyManageItem from './ActivelyManageItem';

const NonconformityActivelyManageItem = ({ organizationId, onLink, guidelines }) => (
  <EntityManagerItem
    {...{ organizationId, onLink }}
    itemId="nonconformity"
    label="Nonconformity"
    guidance={NonConformitiesHelp.nonConformity}
    type={ProblemTypes.NON_CONFORMITY}
    component={NonconformityAddContainer}
    render={ActivelyManageItem}
  >
    <NewNonconformityCard {...{ organizationId, guidelines }} />
  </EntityManagerItem>
);

NonconformityActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  guidelines: PropTypes.object,
};

export default NonconformityActivelyManageItem;
