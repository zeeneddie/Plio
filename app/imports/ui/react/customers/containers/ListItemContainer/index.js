import { compose, withHandlers, mapProps } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { connect } from 'react-redux';

import CustomersListItem from '../../components/ListItem';
import { setUrlItemId } from '/client/redux/actions/globalActions';
import { UserMembership } from '/imports/share/constants';
import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';
import propTypes from './propTypes';

const CustomersListItemContainer = compose(
  mapProps((props) => {
    const href = (() => {
      const params = { urlItemId: props.organization._id };

      return FlowRouter.path('customer', params);
    })();

    const isActive = props.urlItemId === props.organization._id;

    const orgId = props.organization._id;
    const orgName = props.organization.name;
    const orgCreatedAt = getFormattedDate(props.organization.createdAt, 'DD MMM YYYY');

    const ownerData = props.organization.users.find(doc => (
      doc.role === UserMembership.ORG_OWNER
    ));
    const orgOwner = ownerData ? getUserFullNameOrEmail(ownerData.userId) : '';

    return {
      href,
      isActive,
      orgId,
      orgName,
      orgCreatedAt,
      orgOwner,
    };
  }),

  connect(),

  withHandlers({
    onClick: props => handler => {
      props.dispatch(setUrlItemId(props.orgId));

      handler({ urlItemId: props.orgId });
    },
  }),
)(CustomersListItem);

CustomersListItemContainer.propTypes = propTypes;

export default CustomersListItemContainer;
