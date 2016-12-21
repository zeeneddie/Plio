import { WebApp } from 'meteor/webapp';
import { _ } from 'meteor/underscore';
import { RISKS, NON_CONFORMITIES } from './exportDocTypes';

WebApp.connectHandlers.use('/export/', (req, res) => {
  const docType = _.last(req.url.split('/'));

  switch (docType) {
    case RISKS:

      break;

    case NON_CONFORMITIES:

      break;

    default:
      res.writeHead(404);
      return res.end();
  }

  res.writeHead(200);
  return res.end(docType);
});
