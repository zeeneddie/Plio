import PropTypes from 'prop-types';
import React from 'react';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  NonconformitySelectInput,
} from '../../components';
import NonconformityAddForm from './NonconformityAddForm';

const NewNonconformityCard = ({
  organizationId,
  nonconformityIds = [],
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
          transformOptions={({ data: { nonconformities: { nonconformities } } }) =>
            mapRejectedEntitiesByIdsToOptions(nonconformityIds, nonconformities)}
          {...{ organizationId }}
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

export default React.memo(NewNonconformityCard);
