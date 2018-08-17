import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import Form from '/imports/ui/react/forms/components/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Checkbox from '/imports/ui/react/forms/components/LegacyCheckbox';

const Filter = ({ statuses, checkedFilters }) => (
  <div className="relative">
    <Form.SubForm name="filter">
      <FormGroup>
        {Object.keys(statuses).map(status =>
          (<Checkbox
            checked={_.contains(checkedFilters, Number(status))}
            name={status}
            text={statuses[status]}
            key={`actions-status-${status}`}
          />))}
      </FormGroup>
    </Form.SubForm>
  </div>
);

Filter.propTypes = {
  statuses: PropTypes.object,
  checkedFilters: PropTypes.arrayOf(PropTypes.number),
};

export default Filter;
