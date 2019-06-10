import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { ListGroup } from 'reactstrap';

import { CustomerTypesNames } from '/imports/share/constants';
import {
  getFormattedTzDate,
  getFormattedDate,
} from '/imports/share/helpers';
import { notRemoved } from '/imports/api/organizations/helpers';
import { getFullNameOrEmail, getEmail } from '/imports/api/users/helpers';
import Wrapper from '../../../../components/Wrapper';
import createReadFields from '../../../../helpers/createReadFields';
import Label from '../../../../components/Labels/Label';
import { SignupPaths, CUSTOMER_SEQUENTIAL_ID } from '../../../constants';

const CustomersRHSBody = ({
  name,
  serialNumber,
  users,
  currency,
  createdAt,
  customerType,
  timezone,
  lastAccessedDate,
  owner,
  homeScreenType,
  signupPath,
}) => {
  const tz = getFormattedTzDate(timezone);
  const orgTimezone = `${tz} ${timezone}`;
  const lastAccessedDateText = lastAccessedDate && getFormattedDate(lastAccessedDate)
    || 'No date available';
  const orgName = (
    <span>
      <span>{name}</span>
      <Label margin="left">
        <span>{CUSTOMER_SEQUENTIAL_ID}{serialNumber}</span>
      </Label>
    </span>
  );
  const data = [
    { label: 'Org name', text: orgName },
    { label: 'Org owner', text: getFullNameOrEmail(owner) },
    { label: 'Email', text: getEmail(owner) },
    { label: 'Org timezone', text: orgTimezone },
    { label: 'Default currency', text: currency },
    { label: 'Number of members', text: _.filter(users, notRemoved).length },
    { label: 'Last accessed', text: lastAccessedDateText },
    { label: 'Created date', text: getFormattedDate(createdAt) },
    { label: 'Type', text: CustomerTypesNames[customerType] },
    { label: 'Sign-up path', text: SignupPaths[homeScreenType] },
    { label: 'Customer sign-up path', text: signupPath },
  ];
  const fields = _.values(createReadFields(data)).map((field, i) => ({
    ...field,
    key: field.props.label || i,
  }));

  return (
    <Wrapper>
      <ListGroup>
        {fields}
      </ListGroup>
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
  lastAccessedDate: PropTypes.instanceOf(Date),
  owner: PropTypes.object,
  homeScreenType: PropTypes.string,
  signupPath: PropTypes.string,
};

export default CustomersRHSBody;
