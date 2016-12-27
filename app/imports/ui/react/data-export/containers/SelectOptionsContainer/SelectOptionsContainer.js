import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { compose, withProps, withState, withHandlers } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/client/redux/store';
import { pickDeep } from '/imports/api/helpers';

import SelectOptions from '../../components/SelectOptions';
import initMainData from '../../loaders/initMainData';

const enhance = compose(
  withProps(() => ({ store })),
  withState('downloadLink', 'setDownloadLink', ''),
  withState('processing', 'setProcessing', false),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onSubmit: ({
      organization,
      setDownloadLink,
      setProcessing,
      docType,
      handleMethodResult,
    }) => data => {
      setProcessing(true);
      const selectedFields = Object
        .keys(data)
        .filter(key => Boolean(data[key]));

      Meteor.call(
        'DataExport.generateLink', {
          docType,
          org: organization,
          fields: selectedFields,
        }, handleMethodResult((err, result) => {
          setProcessing(false);

          if (err) return;

          setDownloadLink(`http://localhost:3000/export/${result.fileName}?token=${result.token}`);
        }));
    },
  }),
);

export default enhance(SelectOptions);
