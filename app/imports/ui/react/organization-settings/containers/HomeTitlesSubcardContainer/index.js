import { changeTitle } from '/imports/api/organizations/methods';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store.js';
import HomeTitlesSubcard from '../../components/HomeTitlesSubcard';
import initMainData from '../loaders/initMainData';

import { pickDeep } from '/imports/api/helpers';

const enhance = compose(
  withProps({ store }),
  withState('collapsed', 'setCollapsed', true),
  withState('isHelpCollapsed', 'setIsHelpCollapsed', true),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onFieldChangeHandler: ({ organization }) => (fieldName, fieldValue) => {
      changeTitle.call({
        fieldName,
        fieldValue,
        organizationId: organization._id,
      });
    },
  }),
);

export default enhance(HomeTitlesSubcard);
