import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { createWriteStream } from 'fs';
import moment from 'moment-timezone';
import Future from 'fibers/future';
import csv from 'fast-csv';

import * as Mapping from './mapping';
import DataAggregator from './DataAggregator';
import { getLastModifiedFileTime, createMd5Hash } from './helpers';
import { isOrgMember } from '../checkers';

function createFileInfo(orgName, docType) {
  const filteredOrgName = orgName.replace(/\W/g, '');
  const date = moment().format('D-MMM-YYYY');
  const name = `${filteredOrgName}-${docType}-Data-Export-${date}.csv`;
  const path = `/tmp/${name}`;

  return { name, path };
}

function saveData(file, fields, mapping, data) {
  const streamFuture = new Future();
  const stream = createWriteStream(file.path);
  const writer = csv
    .format({ headers: true, quoteColumns: true })
    .transform((row) => _.object(
      fields.map(field => mapping.fields[field].label),
      fields.map(field => {
        const { format } = mapping.fields[field];

        return _.isFunction(format) && format(row[field]) || row[field];
      }),
    ));

  writer.on('finish', () => streamFuture.return({
    fileName: file.name,
    token: createMd5Hash(getLastModifiedFileTime(file.path)),
  }));

  writer.pipe(stream);
  data.forEach(entity => writer.write(entity));
  writer.end();

  return streamFuture.wait();
}

Meteor.methods({
  'DataExport.generateLink'({ org, docType, fields, filters }) {
    if (!isOrgMember(this.userId, org._id)) {
      throw new Meteor.Error(`${this.userId} is't member of organization ${org._id}`);
    }

    if (!(docType in Mapping)) {
      throw new Meteor.Error('bad-doc-type-for-export', 'Bad document type for export');
    }

    const { mapping } = Mapping[docType];

    const file = createFileInfo(org.name, docType);

    // get field order from mapping
    const sortedFields = _.intersection(Object.keys(mapping.fields), fields);
    const dataAggregator = new DataAggregator(
      fields.map(String),
      filters.map(Number),
      mapping,
      org._id
    );

    return saveData(file, sortedFields, mapping, dataAggregator.fetch());
  },
});
