import React from 'react';

import propTypes from './propTypes';
import PreloaderButton from '../../../../components/PreloaderButton';
import ToggleExpandButton from '../../../../components/ToggleExpandButton';
import DiscussButton from '../../../../components/DiscussButton';

const StandardsRHSHeader = (props) => (
  <div className="card-block card-heading">
    <div className="card-heading-buttons pull-xs-right">
      {props.isReady ? (
        <div>
          {props.hasDocxAttachment && (
            <ToggleExpandButton onClick={props.onToggleScreenMode} />
          )}
          {!props.isDiscussionOpened && (
            <DiscussButton
              onClick={props.onDiscussionOpen}
              href={''}
              // href={props.pathToDiscussion}
              title={props.names.discuss}
              // TODO: unreadMessagesCount={}
            />
          )}
          {props.hasAccess && (
            <div>
              {props.isDeleted ? (
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
        <PreloaderButton />
      )}
    </div>
    <h3 className="card-title">
      {props.names.header}
    </h3>
  </div>
);

StandardsRHSHeader.propTypes = propTypes;

export default StandardsRHSHeader;
