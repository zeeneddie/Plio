import React from 'react';
import DiscussionContainer from '../../../discussion/containers/DiscussionContainer';
import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/StandardsLHSContainer';
import StandardsRHSContainer from '../../containers/StandardsRHSContainer';


const StandardsPage = (props) => {
  let classNames;

  if (props.isDiscussionOpened) {
    classNames = {
      lhs: 'content-cards scroll',
      rhs: 'content-cards content-cards-flush scroll',
    };
  }

  return props.organization ? (
    <PageContainer classNames={classNames}>
      {(!props.isDiscussionOpened ? <StandardsLHSContainer /> : null)}
      <StandardsRHSContainer />
      {(props.isDiscussionOpened ? <DiscussionContainer {...props} /> : null)}
    </PageContainer>
  ) : (
    <NotFoundPage
      subject="organization"
      subjectId={props.orgSerialNumber}
    />
  );
};

export default StandardsPage;
