/* eslint-disable react/prop-types, no-unused-expressions */

import React from 'react';
import { compose, withHandlers, withProps, setPropTypes } from 'recompose';
import { connect } from 'react-redux';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import { transsoc } from '/imports/api/helpers';
import { setShowCard } from '/client/redux/actions/mobileActions';
import propTypes from './propTypes';

const ListItemLink = (props) => (
  <a
    className={props.className}
    href={props.href}
    onClick={props.onHandleClick}
  >
    {props.children}
  </a>
);

export default compose(
  setPropTypes(propTypes),
  connect(),
  withProps(transsoc({
    className: props => `list-group-item ${props.isActive && 'active'}`,
  })),
  withHandlers({
    onHandleClick: ({ onClick, dispatch }) => () => {
      _.isFunction(onClick) && onClick((params) => {
        dispatch(setShowCard(true));

        FlowRouter.setParams(params);
      });
    },
  })
)(ListItemLink);
