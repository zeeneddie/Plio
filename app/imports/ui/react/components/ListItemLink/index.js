import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';

import { isMobileRes } from '/imports/api/checkers.js';
import { transsoc } from '/imports/api/helpers';

const ListItemLink = (props) => (
  <a className={props.className}
     href={props.href}
     onClick={props.onHandleClick}>
    {props.children}
  </a>
);

export default compose(
  withProps(transsoc({
    className: props => `list-group-item ${props.isActive && 'active'}`
  })),
  withHandlers({
    onHandleClick: ({ onClick }) => e => {
      _.isFunction(onClick) && onClick((params) => {
        const mobileWidth = isMobileRes();

        if (isMobileRes) {
          // TODO: change view for mobile devices
        }

        FlowRouter.setParams(params);
      });
    }
  })
)(ListItemLink);
