import PropTypes from 'prop-types';
import React, { memo } from 'react';
import moment from 'moment-timezone';
import { ApolloConsumer } from 'react-apollo';
import { propEq, prop } from 'ramda';

import { renderComponent } from '../../helpers';
import { OrgCurrencies } from '../../../../share/constants';
import { insert } from '../../../../api/organizations/methods';
import { Query as Queries } from '../../../graphql';
import validateOrganization from '../../../validation/validators/validateOrganization';
import FlowRouterContext from '../../components/FlowRouter/FlowRouterContext';

const OrganizationAddContainer = memo(({
  organizationId,
  user,
  onLink,
  ...props
}) => (
  <FlowRouterContext>
    {({ router }) => (
      <ApolloConsumer>
        {client => renderComponent({
          ...props,
          initialValues: {
            email: user.email,
            timezone: moment.tz.guess(),
            name: '',
            owner: user.profile.fullName,
            currency: OrgCurrencies.GBP,
          },
          onSubmit: async (values) => {
            const errors = validateOrganization(values);

            if (errors) return errors;

            const {
              name,
              timezone,
              template: { value: template } = {},
              currency,
            } = values;
            const args = {
              name,
              timezone,
              template,
              currency,
            };

            const insertedId = await insert.callP(args);
            // we're using client.query with 'network-only' here
            // because "skip" prop above doesn't let us call refetch
            if (organizationId) {
              const {
                data: {
                  organizations: {
                    organizations: newOrganizations = [],
                  },
                },
              } = await client.query({
                query: Queries.ORGANIZATIONS_MENU,
                variables: { organizationId },
                fetchPolicy: 'network-only',
              });
              const newOrg = newOrganizations.find(propEq('_id', insertedId));
              const serialNumber = prop('serialNumber', newOrg);
              if (serialNumber) router.setParams({ orgSerialNumber: serialNumber });
            }

            if (onLink) onLink(insertedId);

            return undefined;
          },
        })}
      </ApolloConsumer>
    )}
  </FlowRouterContext>
));

OrganizationAddContainer.propTypes = {
  organizationId: PropTypes.string,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OrganizationAddContainer;
