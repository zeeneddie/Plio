import { Meteor } from 'meteor/meteor';
import { Risks } from '/imports/share/collections/risks';
import { createWriteStream } from 'fs';
import Future from 'fibers/future';
import csv from 'fast-csv';

Meteor.methods({
  'DataExport.generateLink'({ docType, fields }) {
    const streamFuture = new Future();
    const stream = createWriteStream('/tmp/testFile.csv');
    const writer = csv.format({ headers: true, quoteColumns: true });
    writer.on('end', () => streamFuture.return('ended'))

    writer.pipe(stream);
    Risks.find().forEach(risk => writer.write(risk));
    writer.end();
    
    return streamFuture.wait();
  },
});
