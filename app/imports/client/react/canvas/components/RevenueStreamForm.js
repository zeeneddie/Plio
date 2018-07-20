import PropTypes from 'prop-types';
import React from 'react';

import CanvasForm from './CanvasForm';
import { FormField, PercentInputField } from '../../components';

const RevenueStreamForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      % of revenue
      <PercentInputField name="percentOfRevenue" />
    </FormField>
    <FormField>
      % of profit
      <PercentInputField name="percentOfProfit" />
    </FormField>
  </CanvasForm>
);

RevenueStreamForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default RevenueStreamForm;
