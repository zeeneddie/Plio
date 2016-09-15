import React from 'react';

export default class Message extends React.Component {
  render() {
    console.log('rendered');
    return (
      <div className="chat-message-container">
        <p className="chat-item-content">
          {this.props.text}
        </p>
      </div>
    );
  }
}

// const Message = (props) => (
//   <div className="chat-message-container">
//     <p className="chat-item-content">
//       {props.text}
//     </p>
//   </div>
// );
//
// export default Message;
