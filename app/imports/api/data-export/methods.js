import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import moment from 'moment-timezone';
import { createWriteStream } from 'fs';
import Future from 'fibers/future';
import csv from 'fast-csv';
import * as Mapping from './mapping';
import getExportData from './getExportData';
import { getLastModifiedFileTime, createMd5Hash } from './helpers';

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
      fields.map(field => (
        mapping.fields[field].mapper
          ? mapping.fields[field].mapper[row[field]]
          : row[field]
      )),
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
  'DataExport.generateLink'({ orgName, docType, fields }) {
    const { mapping } = Mapping[docType];
    const file = createFileInfo(orgName, docType);

    // get field order from mapping
    const sortedFields = _.intersection(Object.keys(mapping.fields), fields);

    return saveData(file, sortedFields, mapping, getExportData(fields, mapping));
  },
});
