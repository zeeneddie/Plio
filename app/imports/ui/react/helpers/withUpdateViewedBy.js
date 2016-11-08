import { lifecycle, setPropTypes, compose } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { handleMethodResult } from '/imports/api/helpers';
import { PropTypes } from 'react';
import { _id } from './propTypes';

const updater = (method, props) =>
  props.isNew && props.isActive && Meteor.defer(() =>
    method.call({ _id: props._id }, handleMethodResult));

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
};

export default method => compose(
  setPropTypes({
    _id,
    ...propTypes,
  }),
  lifecycle({
    componentWillMount() {
      updater(method, this.props);
    },
    componentWillReceiveProps(nextProps) {
      updater(method, nextProps);
    },
  })
);
