import React from 'react';

import {
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerForm,
  EntityManagerForms,
} from '../../components';
import MilestoneForm from './MilestoneForm';

const NewMilestoneCard = props => (
  <EntityManagerForms>
    <EntityManagerCards
      {...props}
      label="New milestone"
      component={EntityManagerForm}
      render={EntityManagerCard}
    >
      <MilestoneForm />
    </EntityManagerCards>
    <EntityManagerAddButton>Add a milestone</EntityManagerAddButton>
  </EntityManagerForms>
);

export default NewMilestoneCard;
