import React from 'react';

import FormField from '../../../fields/edit/components/FormField';

const ModalEdit = () => (
  <div className="relative">
    <div className="card-block">
      <FormField helpText="Hello World">
        <span>Org name</span>
        <input type="text" className="form-control" />
      </FormField>
    </div>
  </div>
);

export default ModalEdit;
