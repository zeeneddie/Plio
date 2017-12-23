/* eslint-disable react/jsx-pascal-case */

import PropTypes from 'prop-types';

import React from 'react';

import PreloaderPage from '../../../components/PreloaderPage';
import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';
import DiscussionFileUploaderContainer from '../../containers/DiscussionFileUploaderContainer';
import RHS from '../../../components/RHS';
import DiscussionHeader from '../DiscussionHeader';

const Discussion = props => (
  <RHS className="flexbox-column">
    <RHS.Card className="chat">
      <DiscussionHeader {...props} />

      {props.discussion ? (
        <MessagesListWrapperContainer {...props} />
      ) : (
        <PreloaderPage />
      )}

      <MessagesFormContainer {...props}>
        <DiscussionFileUploaderContainer {...props} />
      </MessagesFormContainer>
    </RHS.Card>
  </RHS>
);

Discussion.propTypes = {
  discussion: PropTypes.any,
  onBackArrowClick: PropTypes.func.isRequired,
};

export default Discussion;
