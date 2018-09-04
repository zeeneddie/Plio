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
import CustomerNeedSubcard from './CustomerNeedSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';

const CustomerNeeds = ({ documentId, documentType, organizationId }) => (
  <EntityManager>
    {[].map(need => (
      <EntityManagerItem entity={need} component={CustomerNeedSubcard} />
    ))}
    <Mutation mutation={Mutations.CREATE_NEED}>
      {createNeed => (
        <EntityManagerForms>
          <EntityManagerCards
            label="New customer need"
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

              return createNeed({
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
          <EntityManagerAddButton>Add a customer need</EntityManagerAddButton>
        </EntityManagerForms>
      )}
    </Mutation>
  </EntityManager>
);

CustomerNeeds.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerNeeds);
