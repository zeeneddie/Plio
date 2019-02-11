import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { ApolloProvider, Query } from 'react-apollo';

import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
  HelpInfo,
  GuidanceIcon,
  GuidancePanel,
  Pull,
} from '../../components';
import { Query as Queries } from '../../../graphql';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { swal } from '../../../util';
import { WithToggle } from '../../helpers';
import { client } from '../../../apollo';
import DepartmentsSubcardForm from './DepartmentsSubcardForm';

const DepartmentsSubcard = ({ organizationId }) => (
  <ApolloProvider {...{ client }}>
    <WithToggle>
      {({ isOpen, toggle }) => (
        <Query
          query={Queries.DEPARTMENT_COUNT}
          variables={{ organizationId }}
          onError={swal.error}
        >
          {({ data: { departments: { totalCount } = {} } = {} }) => (
            <Subcard {...{ isOpen, toggle }}>
              <SubcardHeader>
                <Pull left>
                  <CardTitle>
                    Departments/teams
                  </CardTitle>
                </Pull>
                <Pull right>
                  <CardTitle className="text-muted">
                    {totalCount || ''}
                  </CardTitle>
                </Pull>
              </SubcardHeader>
              <SubcardBody>
                <CardBlock>
                  <DepartmentsSubcardForm {...{ organizationId, isOpen }} />
                </CardBlock>
                <WithToggle>
                  {guidancePanelState => (
                    <HelpInfo>
                      <GuidanceIcon onClick={guidancePanelState.toggle} />
                      <GuidancePanel
                        isOpen={guidancePanelState.isOpen}
                        toggle={guidancePanelState.toggle}
                      >
                        {OrganizationSettingsHelp.departments}
                      </GuidancePanel>
                    </HelpInfo>
                  )}
                </WithToggle>
              </SubcardBody>
            </Subcard>
          )}
        </Query>
      )}
    </WithToggle>
  </ApolloProvider>
);

DepartmentsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default React.memo(DepartmentsSubcard);
