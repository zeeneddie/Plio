import React, { PropTypes } from 'react';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDeleteContainer from '../../fields/edit/containers/OrgDeleteContainer';
import SelectSingle from '../../../forms/components/SelectSingle';
import FormField from '../../../fields/edit/components/FormField';

const ModalEdit = ({ organization = {} }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
      <FormField>
        <span>Test</span>
        <SelectSingle
          selected={2}
          onChange={() => null}
          onSelect={() => null}
          items={[
            { text: 'Hello World', value: 1 },
            { text: 'Qwerty', value: 2 },
            { text: 'Lorem ipsum', value: 3 },
          ]}
        />
      </FormField>
    </div>
    <OrgDeleteContainer {...organization} />
  </div>
);

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
