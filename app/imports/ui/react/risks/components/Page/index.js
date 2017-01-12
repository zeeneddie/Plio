import React from 'react';
import { mapProps } from 'recompose';

import RisksLHSContainer from '../../containers/RisksLHSContainer';

import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';
import DiscussionContainer from '../../../discussion/containers/DiscussionContainer';

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

const RisksPage = enhance((props) => (
  props.organization ? (
    <PageContainer classNames={props.classNames}>
      {(!props.isDiscussionOpened ? <RisksLHSContainer {...props} /> : null)}
      <div>RHS component</div>
    </PageContainer>
  ) : (
    <NotFoundPage
      subject="organization"
      subjectId={props.orgSerialNumber}
    />
  )
));

export default RisksPage;
