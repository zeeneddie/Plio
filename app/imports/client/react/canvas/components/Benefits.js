import PropTypes from 'prop-types';
import React from 'react';
import { Mutation } from 'react-apollo';
import { pure } from 'recompose';

import {
  EntityManager,
  EntityManagerForms,
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerItem,
  EntityManagerForm,
} from '../../components';
import BenefitSubcard from './BenefitSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';

const Benefits = ({ documentId, documentType, organizationId }) => (
  <EntityManager>
    {[].map(benefit => (
      <EntityManagerItem entity={benefit} component={BenefitSubcard} />
    ))}
    <Mutation mutation={Mutations.CREATE_BENEFIT}>
      {createBenefit => (
        <EntityManagerForms>
          <EntityManagerCards
            label="New benefit"
            component={EntityManagerForm}
            render={EntityManagerCard}
            initialValues={getCustomerElementInitialValues()}
            onSubmit={(values) => {
              const errors = validateCustomerElement(values);

              if (errors) return errors;

              const {
                title,
                description,
                importance,
              } = values;

              return createBenefit({
                variables: {
                  input: {
                    organizationId,
                    title,
                    description,
                    importance,
                    linkedTo: [{
                      documentId,
                      documentType,
                    }],
                  },
                },
              });
            }}
          >
            <CustomerElementForm />
          </EntityManagerCards>
          <EntityManagerAddButton>Add a benefit</EntityManagerAddButton>
        </EntityManagerForms>
      )}
    </Mutation>
  </EntityManager>
);

Benefits.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(Benefits);
