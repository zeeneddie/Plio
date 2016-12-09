import { compose, mapProps, shallowEqual, shouldUpdate, withHandlers, withProps } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { connect } from 'react-redux';

import { setUrlItemId } from '/client/redux/actions/globalActions';
import { pickC, pickDeep } from '/imports/api/helpers';
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

  mapProps(props => pickC([
    'dispatch',
    'href',
    'isActive',
    'onClick',
    'title',
    'issueNumber',
    'status',
  ])(props)),

  shouldUpdate((props, nextProps) => !shallowEqual(props, nextProps))
)(HelpDocsLHSListItem);

HelpDocsLHSListItemContainer.propTypes = propTypes;

export default HelpDocsLHSListItemContainer;
