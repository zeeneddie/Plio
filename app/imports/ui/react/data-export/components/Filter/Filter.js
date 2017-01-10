import React, { PropTypes } from 'react';
import Form from '/imports/ui/react/forms/components/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Checkbox from '/imports/ui/react/forms/components/Checkbox';

const Filter = ({ statuses }) => (
  <div className="relative">
    <Form.SubForm name="filter">
      <FormGroup>
        {Object.keys(statuses).map(status =>
          <Checkbox
            checked
            name={status}
            text={statuses[status]}
            key={`actions-status-${status}`}
          />
        )}
      </FormGroup>
    </Form.SubForm>
  </div>
);

Filter.propTypes = {
  statuses: PropTypes.object,
};

export default Filter;
