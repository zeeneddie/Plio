import React from 'react';

const MessageMenu = (props) => (
  <div className="chat-item-dropdown dropdown">
    <button type="button" className="btn btn-link" data-toggle="dropdown">
      <i className="fa fa-ellipsis-h"></i>
    </button>

    <div className="dropdown-menu dropdown-menu-right">
      <a className="dropdown-item pointer js-message-copy-link"
         data-clipboard-text={props.pathToMessageToCopy}
         onClick={e => e.preventDefault()}>
        Copy as link
      </a>

      {props.isAuthor &&
        (<a className="dropdown-item"
            onClick={props.delete}>
          Delete message
        </a>)}
    </div>
  </div>
);

export default MessageMenu;
