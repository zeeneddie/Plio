import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
} from 'reactstrap';
import { propEq, ascend, prop } from 'ramda';

import ModalMixin from '../../../../startup/client/mixins/modal';
import { setSelectedOrgSerialNumber } from '../../../../api/helpers';
import { APP_VERSION, RouteNames } from '../../../../api/constants';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { UserRoles, CustomerTypes } from '../../../../share/constants';
import { Query as Queries } from '../../../graphql';
import { FlowRouterContext, RenderSwitch, Preloader } from '../../components';
import HeaderMenuItem from './HeaderMenuItem';
import StrategyzerCopyright from '../../canvas/components/StrategyzerCopyright';
import OrganizationAddModal
  from '../../organization-settings/components/OrganizationAddModal';
import OrganizationAddContainer
  from '../../organization-settings/containers/OrganizationAddContainer';
import useToggle from '../../hooks/useToggle';

const RouteLabels = {
  [RouteNames.CANVAS]: 'CEO view',
  [RouteNames.DASHBOARD]: 'Operations view',
  [RouteNames.CANVAS_REPORT]: 'Print report',
};

const byName = ascend(prop('name'));

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
        <StyledNav navbar className="nav pull-xs-left" id="OrganizationMenu">
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
                  data: {
                    organizations: { organizations = [] } = {},
                    me: user = {},
                  },
                }) => (
                  <RenderSwitch
                    {...{ error, loading }}
                    renderLoading={<PreloaderStyled />}
                  >
                    <Fragment>
                      {currentOrg && user && user._id && (
                        <OrganizationAddContainer
                          {...{ user }}
                          skip={!isCreateModalOpen}
                          isOpen={isCreateModalOpen}
                          toggle={toggleCreateModal}
                          component={OrganizationAddModal}
                          organizationId={currentOrg._id}
                        />
                      )}
                      <HeaderMenuItem
                        tag="a"
                        href={router.path(RouteNames.DASHBOARD, { orgSerialNumber })}
                        active={routeName === RouteNames.DASHBOARD}
                      >
                        {RouteLabels[RouteNames.DASHBOARD]}
                      </HeaderMenuItem>
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

                      <DropdownItem divider />

                      {organizations
                        .filter(({ customerType }) => customerType !== CustomerTypes.TEMPLATE)
                        .sort(byName)
                        .map(({ _id, name, serialNumber }) => (
                          <HeaderMenuItem
                            key={_id}
                            // TODO delete line below when dashboard page will be on React
                            toggle={!isDashboard}
                            onClick={() => {
                              setSelectedOrgSerialNumber(serialNumber, user._id);
                              router.setParams({ orgSerialNumber: serialNumber });
                            }}
                            active={currentOrg._id === _id}
                          >
                            {name}
                          </HeaderMenuItem>
                        ))}

                      <DropdownItem divider />

                      {user && user.roles && user.roles.includes(UserRoles.CHANGE_ORG_SETTINGS) && (
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

                      {user.isPlioUser && (
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

                      {user.isPlioUser ? (
                        <Fragment>
                          <DropdownItem divider />

                          {organizations
                            .sort(byName)
                            .filter(propEq('customerType', CustomerTypes.TEMPLATE))
                            .map(({ _id, name, serialNumber }) => (
                              <HeaderMenuItem
                                key={_id}
                                // TODO delete line below when dashboard page will be on React
                                toggle={!isDashboard}
                                onClick={() => {
                                  setSelectedOrgSerialNumber(serialNumber, user._id);
                                  router.setParams({ orgSerialNumber: serialNumber });
                                }}
                                active={currentOrg._id === _id}
                              >
                                {name}
                              </HeaderMenuItem>
                            ))}
                        </Fragment>
                      ) : null}

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
