import React from 'react';
import cx from 'classnames';

import StandardsRHSHeader from './StandardsRHSHeader';
import propTypes from './propTypes';

const StandardsRHS = (props) => (
  <div
    className={cx(
      'content-cards-inner flex expandable',
      {
        expanded: props.isFullScreenMode,
        content: !props.standard,
      }
    )}
  >
    <div className="card standard-details">
      <StandardsRHSHeader
        isReady={props.isCardReady}
        names={props.names.headerNames}
      />

      <div className="content-list">
        <a
          onClick={props.toggleCollapse}
          className={cx(
            'list-group-item list-group-subheading list-group-toggle pointer',
            { collapsed: props.collapsed },
          )}
        >
          <h4 className="list-group-item-heading pull-left">
            <span>{props.standard.title}</span>
            {props.standard.status === 'draft' && (
              <span className="label label-danger">
                <span>{`Issue ${props.standard.issueNumber}`}</span>
                <span>Draft</span>
              </span>
            )}
          </h4>
        </a>

        <div
          className={cx(
            'list-group-collapse collapse',
            { in: !props.collapsed }
          )}
        >
          Hello World
        </div>
      </div>
    </div>
  </div>
);

StandardsRHS.propTypes = propTypes;

export default StandardsRHS;
