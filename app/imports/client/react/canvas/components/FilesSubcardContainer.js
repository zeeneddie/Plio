import { Meteor } from 'meteor/meteor';
import { complement, eqProps } from 'ramda';
import { getIds } from 'plio-util';

import { UploaderMetaIdNames } from '../../../../share/constants';
import { composeWithTracker, swal } from '../../../util';
import { Files } from '../../../../share/collections';

import { FilesSubcard } from '../../components';

const enhance = composeWithTracker(
  ({
    documentId,
    documentType,
    organizationId,
    input,
  }, onData) => {
    const subscription = Meteor.subscribe(
      'filesByDocument',
      { _id: documentId, documentType },
      { onStop: error => error && swal.error(error, 'Files subscription error') },
    );

    if (subscription.ready()) {
      const files = Files.find({ organizationId }).fetch();
      input.onChange(getIds(files));
      onData(null, {
        uploaderMetaContext: {
          organizationId,
          [UploaderMetaIdNames[documentType]]: documentId,
        },
      });
    }
  },
  {
    propsToWatch: ['documentId', 'organizationId'],
    shouldSubscribe: complement(eqProps)('documentId'),
  },
);

export default enhance(FilesSubcard);
