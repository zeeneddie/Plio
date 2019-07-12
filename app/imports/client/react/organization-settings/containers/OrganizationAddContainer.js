import PropTypes from 'prop-types';
import React, { memo } from 'react';
import moment from 'moment-timezone';
import {
  propEq,
  prop,
  pathOr,
} from 'ramda';
import { Query } from 'react-apollo';

import { renderComponent } from '../../helpers';
import {
  OrgCurrencies,
  CustomerTypes,
  DEFAULT_TEMPLATE_ORGANIZATION_ID,
} from '../../../../share/constants';
import { insert } from '../../../../api/organizations/methods';
import { Query as Queries } from '../../../graphql';
import validateOrganization from '../../../validation/validators/validateOrganization';
import FlowRouterContext from '../../components/FlowRouter/FlowRouterContext';

const getDefaultTemplate = (data) => {
  const organizations = pathOr([], ['organizations', 'organizations'], data);
  const template = organizations.find(propEq('_id', DEFAULT_TEMPLATE_ORGANIZATION_ID));
  return template ? {
    label: template.name,
    value: template._id,
  } : {
    label: '',
    value: null,
  };
};

const OrganizationAddContainer = memo(({
  organizationId,
  user,
  onLink,
  skip,
  ...props
}) => (
  <FlowRouterContext>
    {({ router }) => (
      <Query
        {...{ skip }}
        query={Queries.ORGANIZATIONS}
        variables={{
          customerType: CustomerTypes.TEMPLATE,
        }}
      >
        {({
          client,
          data,
          loading,
          error,
        }) => renderComponent({
          ...props,
          loading,
          error,
          initialValues: {
            email: user.email,
            timezone: moment.tz.guess(),
            name: '',
            owner: user.profile.fullName,
            currency: OrgCurrencies.GBP,
            template: getDefaultTemplate(data),
          },
          onSubmit: async (values) => {
            const errors = validateOrganization(values);

            if (errors) return errors;

            const {
              name,
              timezone,
              currency,
              template: { value: templateId } = {},
            } = values;
            const args = {
              name,
              timezone,
              templateId,
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
      </Query>
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
