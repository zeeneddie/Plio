import React, { PropTypes } from 'react';

import { CustomerTypesNames } from '/imports/share/constants';
import FormField from '../../../fields/edit/components/FormField';
import FormInput from '../../../forms/components/FormInput';
import Select from '../../../forms/components/Select';

const ModalEdit = ({ organization = {} }) => (
  <div className="relative">
    <div className="card-block">
      <FormField>
        <span>Org name</span>
        <FormInput readOnly disabled value={organization.name} />
      </FormField>
      <FormField>
        <span>Type</span>
        <div className="dropdown">
          <Select
            onChange={() => null}
            value={CustomerTypesNames[organization.customerType]}
            options={Object.keys(CustomerTypesNames).reduce((prev, key) => ([
              ...prev,
              { value: key, text: CustomerTypesNames[key] },
            ]), [])}
          />
        </div>
      </FormField>
    </div>
  </div>
);

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
