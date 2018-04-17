import PropTypes from 'prop-types';
import React from 'react';
import { renameKeys } from 'plio-util';
import { Field } from 'react-final-form';

import {
  CardBlock,
  FormField,
  LinkedEntityInput,
  SwitchViewAdapter,
  SelectInputAdapter,
} from '../../components';
import ActionForm from './ActionForm';

const NewActionForm = ({
  organizationId,
  linkedTo,
  loadActions,
  ...props
}) => (
  <Field
    name="active"
    buttons={[
      <span key="new">New</span>,
      <span key="existing">Existing</span>,
    ]}
    component={SwitchViewAdapter}
  >
    <ActionForm {...{ ...props, organizationId }}>
      <FormField>
        Linked to
        <LinkedEntityInput disabled {...renameKeys({ title: 'value' }, linkedTo)} />
      </FormField>
    </ActionForm>
    <CardBlock>
      <FormField>
        Existing action
        <Field
          loadOptionsOnOpen
          name="action"
          placeholder="Existing action"
          component={SelectInputAdapter}
          loadOptions={loadActions}
        />
      </FormField>
    </CardBlock>
  </Field>
);

NewActionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.object,
  loadActions: PropTypes.func,
};

export default NewActionForm;
