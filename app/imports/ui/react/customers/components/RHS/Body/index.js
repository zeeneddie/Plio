import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import { UserMembership, CustomerTypesNames } from '/imports/share/constants';
import { getUserFullNameOrEmail, getFormattedTzDate } from '/imports/share/helpers';
import { propEq, getC } from '/imports/api/helpers';
import _date_ from '/imports/startup/client/mixins/date';
import Wrapper from '../../../../components/Wrapper';
import createReadFields from '../../../../helpers/createReadFields';
import SequentialId from '../../../fields/read/components/SequentialId';
import Label from '../../../../components/Labels/Label';

const CustomersRHSBody = ({
  name,
  serialNumber,
  users,
  currency,
  createdAt,
  customerType,
  timezone,
  lastAccessedDate,
}) => {
  const owner = getC('userId', users.find(propEq('role', UserMembership.ORG_OWNER)));
  const tz = getFormattedTzDate(timezone);
  const orgTimezone = `${tz} ${timezone}`;
  const data = [
    { label: 'Org name', text: (
      <span>
        <span>{name}</span>
        <Label margin="left"><SequentialId {...{ serialNumber }} /></Label>
      </span>
    ) },
    { label: 'Org owner', text: getUserFullNameOrEmail(owner) },
    { label: 'Org timezone', text: orgTimezone },
    { label: 'Default currency', text: currency },
    { label: 'Number of members', text: _.filter(users, (user) => !user.isRemoved).length },
    { label: 'Last accessed', text: lastAccessedDate && _date_.renderDate(lastAccessedDate) || 'No date available' },
    { label: 'Created date', text: _date_.renderDate(createdAt) },
    { label: 'Type', text: CustomerTypesNames[customerType] },
  ];
  const fields = _.values(createReadFields(data)).map((field, key) => ({
    ...field,
    key,
  }));

  return (
    <Wrapper>
      <div className="list-group">
        {fields}
      </div>
    </Wrapper>
  );
};


CustomersRHSBody.propTypes = {
  name: PropTypes.string,
  serialNumber: PropTypes.number,
  users: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  customerType: PropTypes.number,
  timezone: PropTypes.string,
};

export default CustomersRHSBody;
