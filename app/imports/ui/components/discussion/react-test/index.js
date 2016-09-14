import './react-test.html';
import React from 'react';
import ReactDOM from 'react-dom';
import MessagesListContainer from './containers/MessagesListContainer';
let limit = 50;
Meteor.setInterval(() => limit += 50, 1000);

Template.React_Test.onRendered(function() {
  ReactDOM.render(
    <MessagesListContainer discussionId={this.data.discussionId} limit={limit}/>,
    this.$('#discussion')[0]
  );
});
