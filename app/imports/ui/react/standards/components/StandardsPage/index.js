import React from 'react';
import Page from '../../../components/Page';
import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/StandardsLHSContainer';
import StandardsRHSContainer from '../../containers/StandardsRHSContainer';


const StandardsPage = (props) => props.organization ? (
  <PageContainer>
    <StandardsLHSContainer />
    <StandardsRHSContainer />
  </PageContainer>
) : (
  <NotFoundPage
    subject="organization"
    subjectId={props.orgSerialNumber}
  />
);

export default StandardsPage;
