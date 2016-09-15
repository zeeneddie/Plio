import React from 'react';
import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';

export default class Discussion extends React.Component {
  render() {
    return (
      <div className="chat">
        <MessagesListContainer {...this.props}/>
        <MessagesFormContainer {...this.props}/>
      </div>
    )
  }
};
