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
import FeatureSubcard from './FeatureSubcard';

const Features = ({ features = [] }) => (
  <EntityManager>
    {features.map(feature => (
      <EntityManagerItem entity={feature} component={FeatureSubcard} />
    ))}
    <EntityManagerForms>
      <EntityManagerCards
        label="Features"
        component={EntityManagerCard}
      >
        Features
      </EntityManagerCards>
      <EntityManagerAddButton>Add a feature</EntityManagerAddButton>
    </EntityManagerForms>
  </EntityManager>
);

Features.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
};

export default Features;
