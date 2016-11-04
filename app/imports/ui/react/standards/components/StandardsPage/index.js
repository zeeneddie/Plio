import React from 'react';

import Page from '../../../components/Page';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/StandardsLHSContainer';

const StandardsPage = props => props.organization ? (
  <Page>
    <StandardsLHSContainer {...props}/>
    <div>World Hello</div>
  </Page>
) : (
  <NotFoundPage
    subject="organization"
    subjectId={props.orgSerialNumber} />
);

export default StandardsPage;
