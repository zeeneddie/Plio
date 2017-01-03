import { WebApp } from 'meteor/webapp';
import { readFile } from 'fs';
import { tmpdir } from 'os';
import { _ } from 'meteor/underscore';
import url from 'url';
import { getLastModifiedFileTime, createMd5Hash } from './helpers';

WebApp.connectHandlers.use('/export', (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const fileName = _.last(reqUrl.pathname.split('/'));

  const queryData = reqUrl.query;
  const filePath = `${tmpdir()}/${fileName}`;
  const hash = createMd5Hash(getLastModifiedFileTime(filePath));

  function sendNotFound() {
    res.writeHead(404);
    return res.end('Page not found');
  }

  if (hash !== queryData.token) return sendNotFound();

  return readFile(filePath, (error, result) => {
    if (error) return sendNotFound();

    res.writeHead(200, { 'Content-type': 'text/csv' });
    return res.end(result);
  });
});
