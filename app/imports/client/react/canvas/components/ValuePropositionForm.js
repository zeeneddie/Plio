import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions } from 'plio-util';
import { pure } from 'recompose';

import { swal } from '../../../util';
import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField } from '../../components';
import { OptionNone } from '../../../../api/constants';

const ValuePropositionForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        placeholder="Matched to"
        onChange={save}
        loadOptions={query => query({
          query: Query.CUSTOMER_SEGMENT_LIST,
          variables: { organizationId },
        }).then(({ data: { customerSegments: { customerSegments } } }) => ({
          options: [
            OptionNone,
            ...mapEntitiesToOptions(customerSegments),
          ],
        })).catch(swal.error)}
      />
    </FormField>
  </CanvasForm>
);

ValuePropositionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(ValuePropositionForm);
