import React, { memo, Fragment } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { prop, propEq } from 'ramda';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
} from 'reactstrap';

import ModalMixin from '../../../../startup/client/mixins/modal';
import { setSelectedOrgSerialNumber } from '../../../../api/helpers';
import { APP_VERSION, RouteNames } from '../../../../api/constants';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { OrgCurrencies, UserRoles } from '../../../../share/constants';
import { Query as Queries } from '../../../graphql';
import { FlowRouterContext, RenderSwitch, Preloader } from '../../components';
import HeaderMenuItem from './HeaderMenuItem';
import StrategyzerCopyright from '../../canvas/components/StrategyzerCopyright';
import OrganizationAddModal
  from '../../organization-settings/components/OrganizationAddModal';
import useToggle from '../../hooks/useToggle';
import { insert } from '../../../../api/organizations/methods';
import validateOrganization from '../../../validation/validators/validateOrganization';

const RouteLabels = {
  [RouteNames.CANVAS]: 'Canvas view',
  [RouteNames.DASHBOARD]: 'Operations view',
  [RouteNames.CANVAS_REPORT]: 'Print report',
};

const DropdownMenuStyled = styled(DropdownMenu)`
  min-width: 330px;
`;

const PreloaderStyled = styled(Preloader)`
  display: block;
  width: 20px;
  margin: auto;
  padding: 10px 0;
`;

const EmbeddedHeaderMenuItem = styled(HeaderMenuItem)`
  &.dropdown-item {
    padding-left: 30px;
  }
`;

const StyledNav = styled(Nav)`
  flex: 1;
  .dropdown .dropdown-toggle {
    padding-right: 0;
  }
`;

const OrganizationName = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 140px);
  float: left;
  margin-right: 5px;
`;

const Copyright = styled.div`
  margin-top: 10px;
`;

const OrganizationMenu = memo(({ organization: currentOrg, isDashboard }) => {
  const [isOpen, toggle] = useToggle(false);
  const [isCreateModalOpen, toggleCreateModal] = useToggle(false);

  return (
    <FlowRouterContext getParam="orgSerialNumber" getRouteName>
      {({ orgSerialNumber, routeName, router }) => (
        <StyledNav navbar className="nav pull-xs-left">
          <Dropdown {...{ isOpen, toggle }}>
            <DropdownToggle nav caret>
              <OrganizationName>{currentOrg.name}</OrganizationName>
              <span className="secondary-label"> {RouteLabels[routeName]}</span>
            </DropdownToggle>

            <DropdownMenuStyled>
              <Query
                query={Queries.ORGANIZATIONS_MENU}
                variables={{ organizationId: currentOrg._id }}
                skip={!isOpen}
              >
                {({
                  error,
                  loading,
                  refetch,
                  client,
                  data: {
                    organizations: { organizations = [] } = {},
                    me: {
                      roles = [],
                      profile = {},
                      _id: userId,
                      email,
                      isPlioUser,
                    } = {},
                  },
                }) => (
                  <RenderSwitch
                    {...{ error, loading }}
                    renderLoading={<PreloaderStyled />}
                  >
                    <Fragment>
                      <OrganizationAddModal
                        isOpen={isCreateModalOpen}
                        toggle={toggleCreateModal}
                        initialValues={{
                          email,
                          timezone: moment.tz.guess(),
                          name: '',
                          owner: profile.fullName,
                          currency: OrgCurrencies.GBP,
                        }}
                        onSubmit={async (values) => {
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

                          const organizationId = await insert.callP(args);
                          // we're using client.query with 'network-only' here
                          // because "skip" prop above doesn't let us call refetch
                          const {
                            data: {
                              organizations: {
                                organizations: newOrganizations = [],
                              },
                            },
                          } = await client.query({
                            query: Queries.ORGANIZATIONS_MENU,
                            variables: { organizationId: currentOrg._id },
                            fetchPolicy: 'network-only',
                          });
                          const newOrg = newOrganizations.find(propEq('_id', organizationId));
                          const serialNumber = prop('serialNumber', newOrg);
                          if (serialNumber) router.setParams({ orgSerialNumber: serialNumber });

                          return undefined;
                        }}
                      />
                      <HeaderMenuItem
                        tag="a"
                        href={router.path(RouteNames.CANVAS, { orgSerialNumber })}
                        active={routeName === RouteNames.CANVAS}
                      >
                        {RouteLabels[RouteNames.CANVAS]}
                      </HeaderMenuItem>
                      {routeName === RouteNames.CANVAS && (
                        <EmbeddedHeaderMenuItem
                          tag="a"
                          target="_blank"
                          href={router.path(RouteNames.CANVAS_REPORT, { orgSerialNumber })}
                        >
                          {RouteLabels[RouteNames.CANVAS_REPORT]}
                        </EmbeddedHeaderMenuItem>
                      )}
                      <HeaderMenuItem
                        tag="a"
                        href={router.path(RouteNames.DASHBOARD, { orgSerialNumber })}
                        active={routeName === RouteNames.DASHBOARD}
                      >
                        {RouteLabels[RouteNames.DASHBOARD]}
                      </HeaderMenuItem>

                      <DropdownItem divider />

                      {organizations.map(({ _id, name, serialNumber }) => (
                        <HeaderMenuItem
                          key={_id}
                          // TODO delete line below when dashboard page will be on React
                          toggle={!isDashboard}
                          onClick={() => {
                            setSelectedOrgSerialNumber(serialNumber, userId);
                            router.setParams({ orgSerialNumber: serialNumber });
                          }}
                          active={currentOrg._id === _id}
                        >
                          {name}
                        </HeaderMenuItem>
                      ))}

                      <DropdownItem divider />

                      {roles.includes(UserRoles.CHANGE_ORG_SETTINGS) && (
                        <HeaderMenuItem
                          onClick={async () => {
                            // eslint-disable-next-line max-len
                            await import('../../../../ui/components/dashboard/includes/organization-menu/settings');

                            ModalMixin.modal.open({
                              template: 'OrgSettings',
                              _title: 'Organization settings',
                              helpText: OrganizationSettingsHelp.organizationSettings,
                              organizationId: currentOrg._id,
                              onDeleteOrg: () => {
                                refetch();
                                router.go(RouteNames.HELLO);
                              },
                            });
                          }}
                        >
                          Organization settings
                        </HeaderMenuItem>
                      )}

                      <HeaderMenuItem onClick={toggleCreateModal}>
                        Create new Plio organization
                      </HeaderMenuItem>

                      {isPlioUser && (
                        <Fragment>
                          <DropdownItem divider />
                          <HeaderMenuItem
                            tag="a"
                            href={router.path(RouteNames.CUSTOMERS)}
                          >
                            Plio organizations
                          </HeaderMenuItem>
                        </Fragment>
                      )}

                      <DropdownItem divider />
                      <HeaderMenuItem disabled>
                        Plio version {APP_VERSION}
                        {routeName === RouteNames.CANVAS && (
                          <Copyright>
                            <StrategyzerCopyright />
                          </Copyright>
                        )}
                      </HeaderMenuItem>
                    </Fragment>
                  </RenderSwitch>
                )}
              </Query>
            </DropdownMenuStyled>
          </Dropdown>
        </StyledNav>
      )}
    </FlowRouterContext>
  );
});

OrganizationMenu.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  isDashboard: PropTypes.bool,
};

export default OrganizationMenu;
