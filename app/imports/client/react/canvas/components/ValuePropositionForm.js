import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions, getEntityOptions } from 'plio-util';

import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField } from '../../components';
import CanvasMatchField from './CanvasMatchField';

const optionGuidance = {
  label: 'Select an unmatched segment.\n' +
  '(Each value proposition can only be matched to 1 customer segment)',
  value: '',
};

const ValuePropositionForm = ({
  organizationId,
  matchedTo,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <CanvasMatchField
        name="matchedTo"
        placeholder="Matched to"
        onChange={save}
        loadOptions={query => query({
          query: Query.CUSTOMER_SEGMENT_LIST,
          variables: { organizationId, isUnmatched: true },
        })}
        transformOptions={({ data: { customerSegments: { customerSegments } } }) => {
          const options = [];

          if (matchedTo) options.push(getEntityOptions(matchedTo));

          options.push(
            ...mapEntitiesToOptions(customerSegments),
            optionGuidance,
          );

          return options;
        }}
      />
    </FormField>
  </CanvasForm>
);

ValuePropositionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  matchedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  save: PropTypes.func,
};

export default React.memo(ValuePropositionForm);
