import PropTypes from 'prop-types';
import React from 'react';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  PotentialGainSelectInput,
} from '../../components';
import NonconformityAddForm from './NonconformityAddForm';

const NewPotentialGainCard = ({
  organizationId,
  potentialGainIds,
  guidelines,
}) => (
  <NewExistingSwitchField name="active">
    <CardBlock>
      <NonconformityAddForm {...{ organizationId, guidelines }} />
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing potential gain
        <PotentialGainSelectInput
          name="nonconformity"
          placeholder="Existing potential gain"
          {...{ organizationId, potentialGainIds }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewPotentialGainCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  potentialGainIds: PropTypes.arrayOf(PropTypes.string),
  guidelines: PropTypes.object,
};

export default NewPotentialGainCard;
