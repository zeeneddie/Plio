import PropTypes from 'prop-types';
import React from 'react';

import {
  EntityManager,
  EntityManagerForms,
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerItem,
} from '../../components';
import CustomerWantSubcard from './CustomerWantSubcard';

const CustomerWants = ({ wants = [] }) => (
  <EntityManager>
    {wants.map(want => (
      <EntityManagerItem entity={want} component={CustomerWantSubcard} />
    ))}
    <EntityManagerForms>
      <EntityManagerCards
        label="Wants"
        component={EntityManagerCard}
      >
        Wants
      </EntityManagerCards>
      <EntityManagerAddButton>Add a customer want</EntityManagerAddButton>
    </EntityManagerForms>
  </EntityManager>
);

CustomerWants.propTypes = {
  wants: PropTypes.arrayOf(PropTypes.object),
};

export default CustomerWants;
