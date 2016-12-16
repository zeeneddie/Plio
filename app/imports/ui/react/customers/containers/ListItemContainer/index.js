import { compose, withHandlers, mapProps, shouldUpdate, setPropTypes } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { connect } from 'react-redux';
import { PropTypes } from 'react';

import CustomersListItem from '../../components/ListItem';
import { setUrlItemId } from '/client/redux/actions/globalActions';
import { UserMembership } from '/imports/share/constants';
import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';
import { notEquals, propEq, getC } from '/imports/api/helpers';

const CustomersListItemContainer = compose(
  setPropTypes({
    urlItemId: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    users: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      role: PropTypes.string,
    })),
  }),
  shouldUpdate((props, nextProps) => !!(
    (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
    (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
    props.name !== nextProps.name ||
    props.createdAt !== nextProps.createdAt ||
    notEquals(props.users, nextProps.users)
  )),
  mapProps((props) => {
    const href = (() => {
      const params = { urlItemId: props._id };

      return FlowRouter.path('customer', params);
    })();

    const isActive = props.urlItemId === props._id;
    const createdAt = getFormattedDate(props.createdAt, 'DD MMM YYYY');
    const ownerData = props.users.find(propEq('role', UserMembership.ORG_OWNER));
    const owner = getUserFullNameOrEmail(getC('userId', ownerData));

    return {
      href,
      isActive,
      createdAt,
      owner,
      name: props.name,
    };
  }),

  connect(),

  withHandlers({
    onClick: props => handler => {
      props.dispatch(setUrlItemId(props._id));

      handler({ urlItemId: props._id });
    },
  }),
)(CustomersListItem);

export default CustomersListItemContainer;
