import PropTypes from 'prop-types';
import React from 'react';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  NonconformitySelectInput,
} from '../../components';
import NonconformityAddForm from './NonconformityAddForm';

const NewNonconformityCard = ({
  organizationId,
  nonconformityIds,
  guidelines,
}) => (
  <NewExistingSwitchField name="active">
    <CardBlock>
      <NonconformityAddForm {...{ organizationId, guidelines }} />
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing nonconformity
        <NonconformitySelectInput
          name="nonconformity"
          placeholder="Existing nonconformity"
          {...{ organizationId, nonconformityIds }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewNonconformityCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  nonconformityIds: PropTypes.arrayOf(PropTypes.string),
  guidelines: PropTypes.object,
};

export default NewNonconformityCard;
