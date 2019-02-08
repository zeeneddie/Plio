import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions, getEntityOptions } from 'plio-util';
import { pure } from 'recompose';

import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, GroupSelect } from '../../components';
import { OptionNone } from '../../../../api/constants';

const ValuePropositionForm = ({
  organizationId,
  matchedTo,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <GroupSelect
        name="matchedTo"
        placeholder="Matched to"
        multi={false}
        onChange={save}
        loadOptions={query => query({
          query: Query.CUSTOMER_SEGMENT_LIST,
          variables: { organizationId, isUnmatched: true },
        })}
        transformOptions={({ data: { customerSegments: { customerSegments } } }) => {
          const options = [];

          if (matchedTo) options.push(getEntityOptions(matchedTo));

          options.push(...mapEntitiesToOptions(customerSegments));

          return {
            options: [
              {
                label: 'Unmatched customer segments:',
                options,
              },
              {
                label: '(Each value proposition can only be matched to 1 customer segment)',
                options: [OptionNone],
              },
            ],
          };
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

export default pure(ValuePropositionForm);
