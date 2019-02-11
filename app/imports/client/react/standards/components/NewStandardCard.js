import PropTypes from 'prop-types';
import React from 'react';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  StandardSelectInput,
} from '../../components';
import StandardAddForm from './StandardAddForm';

const NewStandardCard = ({
  organizationId,
  standardIds = [],
}) => (
  <NewExistingSwitchField name="active">
    <CardBlock>
      <StandardAddForm {...{ organizationId }} />
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing standard
        <StandardSelectInput
          name="standard"
          placeholder="Existing standard"
          transformOptions={({ data: { standards: { standards } } }) =>
            mapRejectedEntitiesByIdsToOptions(standardIds, standards)}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewStandardCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standardIds: PropTypes.arrayOf(PropTypes.string),
};

export default React.memo(NewStandardCard);
