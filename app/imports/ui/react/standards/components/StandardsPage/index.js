import React from 'react';

import Page from '../../../components/Page';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/StandardsLHSContainer';

const StandardsPage = (props) => {
  let content;

  if (props.organization) {
    content = (
      <Page>
        <StandardsLHSContainer {...props}/>
        <div>World Hello</div>
      </Page>
    );
  } else {
    content = (
      <NotFoundPage
        subject="organization"
        subjectId={props.orgSerialNumber} />
    );
  }

  return content;
}

export default StandardsPage;
