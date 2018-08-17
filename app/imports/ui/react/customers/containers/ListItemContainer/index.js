import { compose, withHandlers, mapProps, shouldUpdate, setPropTypes } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CustomersListItem from '../../components/ListItem';
import { setUrlItemId } from '/imports/client/store/actions/globalActions';
import { UserMembership } from '/imports/share/constants';
import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';
import { notEquals, propEq, getC } from '/imports/api/helpers';
import { getPath } from '/imports/ui/utils/router/paths';

const CustomersListItemContainer = compose(
  setPropTypes({
    urlItemId: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    serialNumber: PropTypes.number,
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
  mapProps(({
    _id, urlItemId, users, ...props
  }) => {
    const href = getPath('customer')({ urlItemId: _id });
    const isActive = urlItemId === _id;
    const createdAt = getFormattedDate(props.createdAt, 'DD MMM YYYY');
    const ownerData = users.find(propEq('role', UserMembership.ORG_OWNER));
    const owner = getUserFullNameOrEmail(getC('userId', ownerData));

    return {
      ...props,
      _id,
      href,
      isActive,
      createdAt,
      owner,
    };
  }),

  connect(),

  withHandlers({
    onClick: props => (handler) => {
      props.dispatch(setUrlItemId(props._id));

      handler({ urlItemId: props._id });
    },
  }),
)(CustomersListItem);

export default CustomersListItemContainer;
