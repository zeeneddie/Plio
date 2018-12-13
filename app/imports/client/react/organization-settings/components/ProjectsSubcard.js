import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { ApolloProvider, Query } from 'react-apollo';
import { pure } from 'recompose';

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
import ProjectsSubcardForm from './ProjectsSubcardForm';

const ProjectsSubcard = ({ organizationId }) => (
  <ApolloProvider {...{ client }}>
    <WithToggle>
      {({ isOpen, toggle }) => (
        <Query
          query={Queries.PROJECT_COUNT}
          variables={{ organizationId }}
          onError={swal.error}
        >
          {({ data: { projects: { totalCount } = {} } = {} }) => (
            <Subcard {...{ isOpen, toggle }}>
              <SubcardHeader>
                <Pull left>
                  <CardTitle>
                    Projects
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
                  <ProjectsSubcardForm {...{ organizationId, isOpen }} />
                </CardBlock>
                <WithToggle>
                  {guidancePanelState => (
                    <HelpInfo>
                      <GuidanceIcon onClick={guidancePanelState.toggle} />
                      <GuidancePanel
                        isOpen={guidancePanelState.isOpen}
                        toggle={guidancePanelState.toggle}
                      >
                        {OrganizationSettingsHelp.projects}
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

ProjectsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(ProjectsSubcard);
