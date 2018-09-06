import PropTypes from 'prop-types';
import React from 'react';
import { Mutation } from 'react-apollo';
import { pure } from 'recompose';
import { noop } from 'plio-util';

import {
  EntityManager,
  EntityManagerForms,
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerItem,
  EntityManagerForm,
} from '../../components';
import CustomerElementSubcard from './CustomerElementSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations, Query as Queries } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';
import { Composer } from '../../helpers';

const Features = ({
  documentId,
  documentType,
  organizationId,
  features,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.CREATE_FEATURE} children={noop} />,
      <Mutation mutation={Mutations.UPDATE_FEATURE} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([createFeature, updateFeature]) => (
      <EntityManager>
        {features.map(feature => (
          <EntityManagerItem
            key={feature._id}
            entity={feature}
            customerElement={feature}
            onUpdate={updateFeature}
            component={CustomerElementSubcard}
          />
        ))}
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
                refetchQueries: [{
                  query: Queries.VALUE_PROPOSITION_CARD,
                  variables: { _id: documentId, organizationId },
                }],
              });
            }}
          >
            <CustomerElementForm />
          </EntityManagerCards>
          <EntityManagerAddButton>Add a feature</EntityManagerAddButton>
        </EntityManagerForms>
      </EntityManager>
    )}
  </Composer>
);

Features.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(Features);
