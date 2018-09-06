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

const CustomerNeeds = ({
  needs,
  documentId,
  documentType,
  organizationId,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.CREATE_NEED} children={noop} />,
      <Mutation mutation={Mutations.UPDATE_NEED} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([createNeed, updateNeed]) => (
      <EntityManager>
        {needs.map(need => (
          <EntityManagerItem
            key={need._id}
            entity={need}
            customerElement={need}
            onUpdate={updateNeed}
            component={CustomerElementSubcard}
          />
        ))}
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
                refetchQueries: [{
                  query: Queries.CUSTOMER_SEGMENT_CARD,
                  variables: { _id: documentId, organizationId },
                }],
              });
            }}
          >
            <CustomerElementForm />
          </EntityManagerCards>
          <EntityManagerAddButton>Add a customer need</EntityManagerAddButton>
        </EntityManagerForms>
      </EntityManager>
    )}
  </Composer>
);

CustomerNeeds.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(CustomerNeeds);
