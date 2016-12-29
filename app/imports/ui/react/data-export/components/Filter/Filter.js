import React, { PropTypes } from 'react';
import CardBlock from 'reactstrap/lib/CardBlock';
import Form from '/imports/ui/react/forms/components/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Checkbox from '/imports/ui/react/forms/components/Checkbox';

const Filter = ({ statuses }) => (
  <div className="relative">
    <Form.SubForm name="filter">
      <CardBlock>
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
      </CardBlock>
    </Form.SubForm>
  </div>
);

Filter.propTypes = {
  statuses: PropTypes.object,
};

export default Filter;
