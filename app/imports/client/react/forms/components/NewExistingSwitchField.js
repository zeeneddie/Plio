import React from 'react';

import SwitchViewField from './SwitchViewField';

const NewExistingSwitchField = props => (
  <SwitchViewField
    {...props}
    buttons={[
      <span key="new">New</span>,
      <span key="existing">Existing</span>,
    ]}
  />
);

export default NewExistingSwitchField;
