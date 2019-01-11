import PropTypes from 'prop-types';
import React from 'react';
import { renameKeys } from 'plio-util';

import {
  CardBlock,
  FormField,
  LinkedEntityInput,
  NewExistingSwitchField,
  ActionSelectInput,
} from '../../components';
import ActionForm from './ActionForm';

const NewActionForm = ({ organizationId, linkedTo, ...props }) => (
  <NewExistingSwitchField name="active">
    <ActionForm {...{ ...props, organizationId }}>
      <FormField>
        Linked to
        <LinkedEntityInput disabled {...renameKeys({ title: 'value' }, linkedTo)} />
      </FormField>
    </ActionForm>
    <CardBlock>
      <FormField>
        Existing action
        <ActionSelectInput
          name="action"
          placeholder="Existing action"
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewActionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.object,
};

export default NewActionForm;
