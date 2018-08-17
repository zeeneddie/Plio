import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import AWS from 'aws-sdk';
import Future from 'fibers/future';
import mammoth from 'mammoth';


export default {

  convertToHtml({
    fileUrl, htmlFileName, s3Params, convertParams, afterConvertation,
  }) {
    const afterConvertBinded = Meteor.bindEnvironment(afterConvertation);
    const fut = new Future();

    HTTP.call('GET', fileUrl, {
      npmRequestOptions: {
        encoding: null,
      },
      responseType: 'buffer',
    }, (err1, res1) => {
      if (err1) {
        return fut.return(new Meteor.Error(err1.message));
      }

      if (!_.contains([
        'application/vnd.openxmlformats',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'binary/octet-stream',
      ], res1.headers['content-type'])) {
        return fut.return(new Meteor.Error(
          'TypeError',
          `Invalid content type - ${res1.headers['content-type']}`,
        ));
      }

      mammoth.convertToHtml({
        buffer: res1.content,
      }, convertParams)
        .then((res2) => {
          const s3 = new AWS.S3();

          // Add some styles here
          const htmlString = `
            <!DOCTYPE html>
            <html>
              <head>
                <link rel="stylesheet" type="text/css" href="https://plio.s3.amazonaws.com/lib/document-preview/perfect-scrollbar/perfect-scrollbar.min.css">
                <link rel="stylesheet" type="text/css" href="https://plio.s3.amazonaws.com/lib/document-preview/custom.css">
                <script src="https://plio.s3.amazonaws.com/lib/document-preview/perfect-scrollbar/perfect-scrollbar.min.js"></script>
                <script src="https://plio.s3.amazonaws.com/lib/document-preview/custom.js"></script>
              </head>
              <body>
                <div id="content">
                  ${res2.value}
                </div>
              </body>
            </html>
          `;

          const defaultParams = {
            Bucket: Meteor.settings.AWSS3Bucket.bucketName,
            ACL: Meteor.settings.AWSS3Bucket.acl,
            Key: `uploads/${Random.id()}-${htmlFileName}`,
            Body: htmlString,
            ContentType: 'text/html; charset=UTF-8',
          };

          const params = Object.assign({}, defaultParams, s3Params);

          s3.upload(params, (err2, data) => {
            if (err2) {
              fut.return(new Meteor.Error(err2.message));
            } else {
              afterConvertBinded(data.Location);
              fut.return(data.Location);
            }
          });
        })
        .catch((e) => {
          fut.return(e);
        })
        .done();
    });

    return fut.wait();
  },

};
