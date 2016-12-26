import React, { PropTypes } from 'react';
import { compose, withState, withHandlers } from 'recompose';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDeleteContainer from '../../fields/edit/containers/OrgDeleteContainer';
import SelectSingle from '../../../forms/components/SelectSingle';
import FormField from '../../../fields/edit/components/FormField';

const enhance = compose(
  withState('selected', 'setSelected', 2),
  withHandlers({
    onSelect: ({ setSelected }) => (e, { value }) => setSelected(value),
  }),
);

const ModalEdit = enhance(({ organization = {}, onSelect, selected }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
      <FormField>
        <span>Test</span>
        <SelectSingle
          placeholder="Hello World"
          selected={selected}
          onChange={() => null}
          onSelect={onSelect}
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
));

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
