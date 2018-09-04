import React from 'react';

import PageContainer from '../../../containers/PageContainer';
import HelpDocsLHSContainer from '../../containers/HelpDocsLHSContainer';
import HelpDocsRHSContainer from '../../containers/HelpDocsRHSContainer';

const HelpDocsPage = () => (
  <PageContainer>
    <HelpDocsLHSContainer />
    <HelpDocsRHSContainer />
  </PageContainer>
);

export default HelpDocsPage;
