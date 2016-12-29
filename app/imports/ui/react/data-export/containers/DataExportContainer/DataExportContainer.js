import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { compose, withProps, withState, withHandlers } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import { pickDeep } from '/imports/api/helpers';

import DataExport from '../../components/DataExport';
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
        .keys(data.fields)
        .filter(key => Boolean(data.fields[key]));

      const selectedFilters = Object
        .keys(data.filter)
        .filter(key => Boolean(data.filter[key]))
        .map(Number);

      Meteor.call(
        'DataExport.generateLink', {
          docType,
          org: organization,
          fields: selectedFields,
          filters: selectedFilters,
        }, handleMethodResult((err, result) => {
          setProcessing(false);
          if (err) return;

          const { fileName, token } = result;
          const downloadLink = Meteor.absoluteUrl(`export/${fileName}?token=${token}`);

          setDownloadLink(downloadLink);
        }));
    },
  }),
);

export default enhance(DataExport);
