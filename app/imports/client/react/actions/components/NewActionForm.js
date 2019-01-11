import PropTypes from 'prop-types';
import React from 'react';
import { renameKeys, mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  LinkedEntityInput,
  NewExistingSwitchField,
  ActionSelectInput,
} from '../../components';
import ActionForm from './ActionForm';

const NewActionForm = ({
  organizationId,
  linkedTo,
  actionIds,
  ...props
}) => (
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
          transformOptions={({ data: { actions: { actions } } }) =>
            mapRejectedEntitiesByIdsToOptions(actionIds, actions)}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewActionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.object,
  actionIds: PropTypes.arrayOf(PropTypes.string),
};

export default NewActionForm;
