import { WebApp } from 'meteor/webapp';
import { readFile } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { _ } from 'meteor/underscore';
import url from 'url';
import checksum from 'checksum';

WebApp.connectHandlers.use('/export', (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const fileName = _.last(reqUrl.pathname.split('/'));

  const queryData = reqUrl.query;
  const filePath = join(tmpdir(), fileName);

  return readFile(filePath, (error, result) => {
    if (error) {
      res.writeHead(404);
      return res.end('File not found. Please, try export data again.');
    }

    if (checksum(result) !== queryData.token) {
      res.writeHead(400);
      return res.end('The file is corrupted. Please, try export data again.');
    }

    res.writeHead(200, {
      'Content-type': 'text/csv',
      'Content-Disposition': 'attachment',
    });
    return res.end(result);
  });
});
