import { lifecycle, setPropTypes, compose } from 'recompose';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { handleMethodResult } from '../../../api/helpers';

const updater = (method, props) =>
  props.isNew && props.isActive && Meteor.defer(() =>
    method.call({ _id: props._id }, handleMethodResult));

const propTypes = {
  _id: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
};

export default method => compose(
  setPropTypes(propTypes),
  lifecycle({
    componentWillMount() {
      updater(method, this.props);
    },
    componentWillReceiveProps(nextProps) {
      updater(method, nextProps);
    },
  }),
);
