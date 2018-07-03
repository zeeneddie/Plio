import React from 'react';
import { mapProps } from 'recompose';

import DiscussionContainer from '../../../discussion/containers/DiscussionContainer';
import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';
import StandardsLHSContainer from '../../containers/LHSContainer';
import StandardsRHSContainer from '../../containers/RHSContainer';

const enhance = mapProps(props => (
  props.isDiscussionOpened ? ({
    ...props,
    doc: props.standard,
    classNames: {
      lhs: 'content-cards scroll',
      rhs: 'content-cards content-cards-flush scroll',
    },
  }) : props
));

const StandardsPage = enhance(props => (
  props.organization ? (
    <PageContainer classNames={props.classNames}>
      {(!props.isDiscussionOpened ? <StandardsLHSContainer /> : null)}
      <StandardsRHSContainer />
      {(props.isDiscussionOpened ? <DiscussionContainer {...props} /> : null)}
    </PageContainer>
  ) : (
    <NotFoundPage
      subject="organization"
      subjectId={props.orgSerialNumber}
    />
  )
));

export default StandardsPage;
