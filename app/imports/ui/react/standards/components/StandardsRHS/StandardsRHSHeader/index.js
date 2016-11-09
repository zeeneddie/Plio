import React from 'react';

const StandardsRHSHeader = (props) => (
  <div className="card-block card-heading">
    <div className="card-heading-buttons pull-xs-right">
      {props.isReady ? (
        <div>
          {props.hasDocxAttachment && (
            <a
              className="btn btn-secondary toggle-expand-btn"
              onClick={props.onToggleScreenMode}
            ></a>
          )}
          {!props.isDiscussionOpened && (
            <a
              className="btn btn-secondary"
              onClick={props.onDiscussionOpen}
              href={props.pathToDiscussion}
            >
              {props.messagesNotViewedCount && (
                <span
                  className="label label-danger label-chat-count"
                >
                  {props.messagesNotViewedCount}
                </span>
              )}
              {props.names.discuss}
            </a>
          )}
          {props.hasAccess && (
            <div>
              {props.standard.isDeleted ? (
                <div>
                  <a className="btn btn-secondary" onCLick={props.onRestore}>
                    {props.names.restore}
                  </a>
                  <div>
                    {props.hasFullAccess && (
                      <a className="btn btn-primary" onClick={props.onDelete}>
                        {props.names.delete}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <a className="btn btn-primary" click={props.onModalOpen}>
                  <i className="fa fa-pencil"></i>
                  {props.names.edit}
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    <h3 className="card-title">
      {props.names.header}
    </h3>
  </div>
);

export default StandardsRHSHeader;
