import React from 'react';

import Page from '../../../components/Page';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/StandardsLHSContainer';
import StandardsRHSContainer from '../../containers/StandardsRHSContainer';

const StandardsPage = (props) => props.organization ? (
  <Page>
    <StandardsLHSContainer/>
    <StandardsRHSContainer/>
  </Page>
) : (
  <NotFoundPage
    subject="organization"
    subjectId={props.orgSerialNumber} />
);

export default StandardsPage;
