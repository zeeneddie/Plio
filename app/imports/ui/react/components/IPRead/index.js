import React from 'react';
import { _ } from 'meteor/underscore';

import FieldReadBlock from '../FieldReadBlock';
import FileItemRead from '../FileItemRead';
import _date_ from '/imports/startup/client/mixins/date';
import _user_ from '/imports/startup/client/mixins/user';
import createReadFields from '../../helpers/createReadFields';
import propTypes from './propTypes';

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
        <FileItemRead key={fileId} fileId={fileId} />
      )),
    },
  ];

  return _.values(createReadFields(data)).map((field, i) => ({ ...field, key: i }));
};

const IPRead = ({
  label = 'Improvement plan',
  desiredOutcome,
  targetDate,
  owner,
  reviewDates = [],
  fileIds = [],
}) => (desiredOutcome || targetDate || owner || reviewDates.length || fileIds.length) ? (
  <FieldReadBlock label={label}>
    {[...renderFields({ desiredOutcome, targetDate, owner, reviewDates, fileIds })]}
  </FieldReadBlock>
) : null;

IPRead.propTypes = propTypes;

export default IPRead;
