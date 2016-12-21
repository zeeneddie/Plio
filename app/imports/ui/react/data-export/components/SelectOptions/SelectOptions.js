import { _ } from 'meteor/underscore';
import React, { PropTypes } from 'react';
import Button from 'reactstrap/lib/Button';
import CardBlock from 'reactstrap/lib/CardBlock';
import Form from '/imports/ui/react/forms/components/Form';
import Checkbox from '/imports/ui/react/forms/components/Checkbox';


const SelectOptions = ({ sections, fields, onSubmit }) => {
  return (
    <div className="relative">
      <Form onSubmit={onSubmit}>
        <CardBlock>
          {sections.map((sectionName) => (
            <div key={`risk-export-${sectionName}`}>
              <div>{sectionName}</div>
              {_.where(fields, { section: sectionName })
                .map(({ name, label }) =>
                  <Checkbox checked name={name} text={label} key={`risk-export-${name}`} />
              )}
            </div>
          ))}
        </CardBlock>
        <CardBlock className="text-xs-center">
          <Button color="primary">Export</Button>
        </CardBlock>
      </Form>
    </div>
  );
};

SelectOptions.propTypes = {
  sections: PropTypes.array.isRequired,
  fields: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
};

export default SelectOptions;
