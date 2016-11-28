import React from 'react';
import HelpsLHSContainer from '../../containers/HelpsLHSContainer';
import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';


const HelpsPage = (props) => props.organization ? (
  <PageContainer>
    <HelpsLHSContainer />
    <div>lorem ipsum</div>
  </PageContainer>
) : (
  <NotFoundPage
    subject="organization"
    subjectId={props.organization.serialNumber}
  />
);

export default HelpsPage;
