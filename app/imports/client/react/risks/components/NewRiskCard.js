import PropTypes from 'prop-types';
import React from 'react';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  LinkedEntityInput,
  NewExistingSwitchField,
  RiskSelectInput,
} from '../../components';
import RiskForm from './RiskForm';

const NewRiskCard = ({
  organizationId,
  riskIds = [],
  guidelines,
  linkedTo = {},
}) => (
  <NewExistingSwitchField name="active">
    <RiskForm {...{ guidelines, organizationId }}>
      <FormField>
        Linked to
        <LinkedEntityInput disabled value={linkedTo.title} sequentialId={linkedTo.sequentialId} />
      </FormField>
    </RiskForm>
    <CardBlock>
      <FormField>
        Existing risk
        <RiskSelectInput
          name="risk"
          placeholder="Existing risk"
          transformOptions={({ data: { risks: { risks } } }) =>
            mapRejectedEntitiesByIdsToOptions(riskIds, risks)}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewRiskCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  riskIds: PropTypes.arrayOf(PropTypes.string),
  guidelines: PropTypes.object,
  linkedTo: PropTypes.object,
};

export default React.memo(NewRiskCard);
