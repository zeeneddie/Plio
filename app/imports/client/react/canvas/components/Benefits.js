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
import BenefitSubcard from './BenefitSubcard';

const Benefits = ({ benefits = [] }) => (
  <EntityManager>
    {benefits.map(benefit => (
      <EntityManagerItem entity={benefit} component={BenefitSubcard} />
    ))}
    <EntityManagerForms>
      <EntityManagerCards
        label="Benefits"
        component={EntityManagerCard}
      >
        Benefits
      </EntityManagerCards>
      <EntityManagerAddButton>Add a benefit</EntityManagerAddButton>
    </EntityManagerForms>
  </EntityManager>
);

Benefits.propTypes = {
  benefits: PropTypes.arrayOf(PropTypes.object),
};

export default Benefits;
