import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import Block from '../Block';
import FileItemContainer from '../../containers/FileItemContainer';
import _date_ from '/imports/startup/client/mixins/date';
import _user_ from '/imports/startup/client/mixins/user';
import createReadFields from '../../../../helpers/createReadFields';

const renderReviewDates = (reviewDates = []) => reviewDates
  .map(doc => _date_.renderDate(doc.date))
  .sort((d1, d2) => new Date(d1) - new Date(d2))
  .join(', ');

const renderFields = ({ desiredOutcome, targetDate, owner, reviewDates, fileIds }) => {
  const data = [
    { label: 'Statement of desired outcome', text: desiredOutcome },
    {
      label: 'Target date for desired outcome',
      text: targetDate && _date_.renderDate(targetDate),
    },
    {
      label: 'Improvement plan review dates',
      text: reviewDates.length && renderReviewDates(reviewDates),
    },
    { label: 'Owner', text: owner && _user_.userNameOrEmail(owner) },
    {
      label: 'Means statement',
      text: fileIds.length && fileIds.map(fileId => (
        <FileItemContainer key={fileId} fileId={fileId} />
      )),
    },
  ];

  return _.values(createReadFields(data)).map((field, key) => ({ ...field, key }));
};

const IPRead = ({
  label = 'Improvement plan',
  desiredOutcome,
  targetDate,
  owner,
  reviewDates = [],
  fileIds = [],
}) => (
  (desiredOutcome || targetDate || owner || reviewDates.length || fileIds.length) ? (
    <Block label={label}>
      {[...renderFields({ desiredOutcome, targetDate, owner, reviewDates, fileIds })]}
    </Block>
  ) : null
);

IPRead.propTypes = {
  label: PropTypes.string.isRequired,
  desiredOutcome: PropTypes.string,
  targetDate: PropTypes.instanceOf(Date),
  owner: PropTypes.string,
  reviewDates: PropTypes.arrayOf(PropTypes.shape({ date: PropTypes.instanceOf(Date) })),
  fileIds: PropTypes.arrayOf(PropTypes.string),
};

export default IPRead;
