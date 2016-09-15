import React from 'react';

export default class Message extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps) {
    console.log('updated');
  }

  render() {
    return (
      <div className="chat-message-container">
        <p className="chat-item-content">
          {this.props.text}
        </p>
      </div>
    );
  }
}
