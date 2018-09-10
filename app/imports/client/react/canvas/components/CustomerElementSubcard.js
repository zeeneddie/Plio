import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';
import { pick } from 'ramda';
import { pure } from 'recompose';

import { EntityForm, EntityCard } from '../../components';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';

const getInitialValues = pick([
  'title',
  'description',
  'importance',
]);

const CustomerElementSubcard = ({
  customerElement,
  isOpen,
  toggle,
  onUpdate,
  onDelete,
}) => (
  <Card>
    <EntityForm
      {...{ isOpen, toggle, onDelete }}
      label={customerElement.title}
      validate={validateCustomerElement}
      onSubmit={({ title, description = '', importance }) => onUpdate({
        variables: {
          input: {
            _id: customerElement._id,
            title,
            description,
            importance,
          },
        },
      })}
      initialValues={getInitialValues(customerElement)}
      component={EntityCard}
    >
      {({ handleSubmit }) => <CustomerElementForm save={handleSubmit} />}
    </EntityForm>
  </Card>
);

CustomerElementSubcard.propTypes = {
  customerElement: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default pure(CustomerElementSubcard);
