import { compose, lifecycle } from 'recompose';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import StandardsRHSBody from '../../components/RHS/Body';
import withStateCollapsed from '../../../helpers/withStateCollapsed';

const setCollapsed = _.throttle(props =>
  props.setCollapsed(() => props.hasDocxAttachment), 800);

export default compose(
  withStateCollapsed(property('hasDocxAttachment')),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.standard._id !== nextProps.standard._id &&
          this.props.hasDocxAttachment !== nextProps.hasDocxAttachment) {
        setCollapsed(nextProps);
      }
    },
  }),
)(StandardsRHSBody);
