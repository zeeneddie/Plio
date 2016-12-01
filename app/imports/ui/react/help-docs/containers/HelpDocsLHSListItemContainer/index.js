import { compose, withHandlers, withProps } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { connect } from 'react-redux';

import { setUrlItemId } from '/client/redux/actions/globalActions';
import { pickDeep } from '/imports/api/helpers';
import HelpDocsLHSListItem from '../../components/HelpDocsLHSListItem';
import propTypes from './propTypes';

const HelpDocsLHSListItemContainer = compose(
  connect(pickDeep(['global.urlItemId'])),
  withHandlers({
    onClick: props => handler => {
      props.dispatch(setUrlItemId(props._id));
      handler({ urlItemId: props._id });
    },
  }),
  withProps((props) => ({
    href: FlowRouter.path('helpDoc', { helpId: props._id }),
    isActive: props.urlItemId === props._id,
  })),
)(HelpDocsLHSListItem);

HelpDocsLHSListItemContainer.propTypes = propTypes;

export default HelpDocsLHSListItemContainer;
