import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  PotentialGainSelectInput,
} from '../../components';
import NonconformityAddForm from './NonconformityAddForm';

const NewPotentialGainCard = ({
  organizationId,
  potentialGainIds = [],
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
          transformOptions={({ data: { potentialGains: { nonconformities } } }) =>
            mapRejectedEntitiesByIdsToOptions(potentialGainIds, nonconformities)}
          {...{ organizationId }}
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

export default pure(NewPotentialGainCard);
