import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { StringLimits } from '../../../../share/constants';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import InputField from '../../forms/components/InputField';
import FormField from '../../forms/components/FormField';
import TimezoneSelect from '../../forms/components/TimezoneSelect';
import CurrencyRadioSelect from '../../forms/components/CurrencyRadioSelect';
import OrgTemplateSelectInput from './OrgTemplateSelectInput';

const OrganizationForm = ({ save }) => (
  <Fragment>
    <FormField guidance={OrganizationSettingsHelp.organizationName}>
      Org name
      <InputField
        name="name"
        placeholder="Org name"
        maxLength={StringLimits.title.max}
        onBlur={save}
        autoFocus
      />
    </FormField>
    <FormField guidance={OrganizationSettingsHelp.organizationOwner}>
      Org owner
      <InputField
        name="owner"
        placeholder="Org owner"
        disabled
      />
    </FormField>
    <FormField>
      Email
      <InputField
        name="email"
        placeholder="Email"
        disabled
      />
    </FormField>
    <FormField guidance={OrganizationSettingsHelp.timeZone}>
      Org timezone
      <TimezoneSelect name="timezone" onChange={save} />
    </FormField>
    <FormField guidance={OrganizationSettingsHelp.template}>
      Template
      <OrgTemplateSelectInput
        name="template"
        onChange={save}
        placeholder="Select organization template..."
      />
    </FormField>
    <FormField guidance={OrganizationSettingsHelp.defaultCurrency}>
      Default currency
      <CurrencyRadioSelect name="currency" onChange={save} />
    </FormField>
  </Fragment>
);

OrganizationForm.propTypes = {
  save: PropTypes.func,
};

export default OrganizationForm;
