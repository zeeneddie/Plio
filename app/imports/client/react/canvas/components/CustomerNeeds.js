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
import CustomerNeedSubcard from './CustomerNeedSubcard';

const CustomerNeeds = ({ needs = [] }) => (
  <EntityManager>
    {needs.map(need => (
      <EntityManagerItem entity={need} component={CustomerNeedSubcard} />
    ))}
    <EntityManagerForms>
      <EntityManagerCards
        label="Needs"
        component={EntityManagerCard}
      >
        Needs
      </EntityManagerCards>
      <EntityManagerAddButton>Add a customer need</EntityManagerAddButton>
    </EntityManagerForms>
  </EntityManager>
);

CustomerNeeds.propTypes = {
  needs: PropTypes.arrayOf(PropTypes.object),
};

export default CustomerNeeds;
