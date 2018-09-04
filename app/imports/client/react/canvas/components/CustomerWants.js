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
import CustomerWantSubcard from './CustomerWantSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';

const CustomerWants = ({ documentId, documentType, organizationId }) => (
  <EntityManager>
    {[].map(want => (
      <EntityManagerItem entity={want} component={CustomerWantSubcard} />
    ))}
    <Mutation mutation={Mutations.CREATE_WANT}>
      {createWant => (
        <EntityManagerForms>
          <EntityManagerCards
            label="New customer want"
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

              return createWant({
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
          <EntityManagerAddButton>Add a customer want</EntityManagerAddButton>
        </EntityManagerForms>
      )}
    </Mutation>
  </EntityManager>
);

CustomerWants.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerWants);
