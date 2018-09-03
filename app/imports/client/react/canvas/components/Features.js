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
import FeatureSubcard from './FeatureSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';

const Features = ({ documentId, documentType, organizationId }) => (
  <EntityManager>
    {[].map(feature => (
      <EntityManagerItem entity={feature} component={FeatureSubcard} />
    ))}
    <Mutation mutation={Mutations.CREATE_FEATURE}>
      {createFeature => (
        <EntityManagerForms>
          <EntityManagerCards
            label="New feature"
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

              return createFeature({
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
          <EntityManagerAddButton>Add a feature</EntityManagerAddButton>
        </EntityManagerForms>
      )}
    </Mutation>
  </EntityManager>
);

Features.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(Features);
