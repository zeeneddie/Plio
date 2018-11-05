import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import StandardAddContainer from '../../../standards/containers/StandardAddContainer';
import NewStandardCard from '../../../standards/components/NewStandardCard';
import ActivelyManageItem from './ActivelyManageItem';

const StandardActivelyManageItem = ({ organizationId, onLink }) => (
  <EntityManagerItem
    {...{ organizationId, onLink }}
    itemId="standard"
    label="Standard"
    component={StandardAddContainer}
    render={ActivelyManageItem}
  >
    <NewStandardCard {...{ organizationId }} />
  </EntityManagerItem>
);

StandardActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
};

export default StandardActivelyManageItem;
