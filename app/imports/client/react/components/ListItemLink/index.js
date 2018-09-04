/* eslint-disable react/prop-types, no-unused-expressions */

import React from 'react';
import cx from 'classnames';
import { compose, withHandlers, withProps, setPropTypes } from 'recompose';
import { connect } from 'react-redux';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import { transsoc } from '/imports/api/helpers';
import { setShowCard } from '/imports/client/store/actions/mobileActions';
import propTypes from './propTypes';

const ListItemLink = props => (
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
    className: props => cx('list-group-item', props.className, { active: props.isActive }),
  })),
  withHandlers({
    onHandleClick: ({ onClick, dispatch }) => () => {
      _.isFunction(onClick) && onClick((params) => {
        dispatch(setShowCard(true));

        FlowRouter.setParams(params);
      });
    },
  }),
)(ListItemLink);
