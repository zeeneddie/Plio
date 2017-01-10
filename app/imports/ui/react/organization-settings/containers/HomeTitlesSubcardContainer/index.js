import { changeTitle } from '/imports/api/organizations/methods';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import HomeTitlesSubcard from '../../components/HomeTitlesSubcard';
import initMainData from '../loaders/initMainData';

import { pickDeep } from '/imports/api/helpers';

const enhance = compose(
  withProps({ store }),
  connect(),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onSelectTitle: ({ organization }) => (e, { text, value }, callback) =>
      changeTitle.call({
        fieldName: `${value}`.replace(/\(.*\)/, ''),
        fieldValue: text,
        organizationId: organization._id,
      }, callback),
  }),
);

export default enhance(HomeTitlesSubcard);
