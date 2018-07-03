import { compose, withState, withHandlers, lifecycle, shallowEqual, pure } from 'recompose';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { not } from '/imports/api/helpers';
import HelpDocsRHSBody from '../../components/HelpDocsRHSBody';

const setCollapsed = _.throttle(props =>
  props.setCollapsed(() => props.hasDocxAttachment), 600);

export default compose(
  pure,
  withState('collapsed', 'setCollapsed', property('hasDocxAttachment')),
  withHandlers({
    onToggleCollapse: props => () => props.setCollapsed(not),
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props.helpDoc, nextProps.helpDoc) &&
          this.props.hasDocxAttachment !== nextProps.hasDocxAttachment) {
        setCollapsed(nextProps);
      }
    },
  }),
)(HelpDocsRHSBody);
