import PropTypes from 'prop-types';
import React from 'react';

import { ActionPlanOptions } from '../../../../share/constants';
import SelectRadioAdapter from '../../forms/components/SelectRadioAdapter';

const ActionPlan = ({ component: Component = SelectRadioAdapter, ...props }) => (
  <Component
    {...props}
    options={Object.values(ActionPlanOptions).map(value => ({
      value,
      label: value,
    }))}
  />
);

ActionPlan.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default ActionPlan;
