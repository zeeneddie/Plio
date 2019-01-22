import React, { Fragment } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { find, propEq } from 'ramda';
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
import { WithToggle } from '../../helpers';
import HeaderMenuItem from './HeaderMenuItem';
import StrategyzerCopyright from '../../canvas/components/StrategyzerCopyright';

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

const OrganizationMenu = ({ organization: currentOrg, isDashboard }) => (
  <FlowRouterContext getParam="orgSerialNumber" getRouteName>
    {({ orgSerialNumber, routeName, router }) => (
      <StyledNav navbar className="nav pull-xs-left">
        <WithToggle>
          {({ isOpen, toggle }) => (
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
                    error, loading, refetch,
                    data: {
                      organizations: { organizations = [] } = {},
                      me: {
                        roles = [],
                        profile = {},
                        _id: userId,
                        isPlioUser,
                      } = {},
                    },
                  }) => (
                    <RenderSwitch
                      {...{ error, loading }}
                      renderLoading={<PreloaderStyled />}
                    >
                      <Fragment>
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

                        <HeaderMenuItem
                          onClick={async () => {
                            // eslint-disable-next-line max-len
                            await import('../../../../ui/components/dashboard/includes/organization-menu/settings');

                            ModalMixin.modal.open({
                              template: 'Organizations_Create',
                              _title: 'New organization',
                              variation: 'save',
                              timezone: moment.tz.guess(),
                              ownerName: profile.fullName,
                              currency: OrgCurrencies.GBP,
                              onCreateOrg: organizationId => refetch().then(({
                                data: {
                                  organizations: { organizations: newOrganizations = [] } = {},
                                },
                              }) => {
                                const findOrganization = find(propEq('_id', organizationId));
                                const { serialNumber } = findOrganization(newOrganizations);
                                router.setParams({ orgSerialNumber: serialNumber });
                              }),
                            });
                          }}
                        >
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
          )}
        </WithToggle>
      </StyledNav>
    )}
  </FlowRouterContext>
);

OrganizationMenu.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  isDashboard: PropTypes.bool,
};

export default OrganizationMenu;
