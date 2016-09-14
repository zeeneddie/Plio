import './react-test.html';
import React from 'react';
import ReactDOM from 'react-dom';
import MessagesListContainer from './containers/MessagesListContainer';

Template.React_Test.onRendered(function() {
  ReactDOM.render(
    <MessagesListContainer discussionId={this.data.discussionId}/>,
    this.$('#discussion')[0]
  );
});
