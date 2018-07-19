import PropTypes from 'prop-types';
import React from 'react';

import CanvasForm from './CanvasForm';
import { FormField, PercentInputField } from '../../components';

const CostLineForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      % of total cost
      <PercentInputField name="percentOfTotalCost" />
    </FormField>
  </CanvasForm>
);

CostLineForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CostLineForm;
