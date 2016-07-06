import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';

import AWS from 'aws-sdk';
import Future from 'fibers/future';
import mammoth from 'mammoth';

import StandardsService from '/imports/api/standards/standards-service.js';


export default {

  convertToHtml({ url, fileName, source, standardId, options }) {
    const standard = Standards.findOne({ _id: standardId });
    const organizationId = standard && standard.organizationId;
    const doesSourceExist = Meteor.bindEnvironment(() => {
      const standardQuery = { _id: standardId };
      standardQuery[source] = { $exists: true };
      const standard = Standards.findOne(standardQuery);
      return !!standard;
    });

    const updateSource = Meteor.bindEnvironment((_id, source, htmlUrl) => {
      if (doesSourceExist()) {
        StandardsService.update({
          _id,
          [`${source}.htmlUrl`]: htmlUrl
        });
      }
    });

    const { bucketName, acl, standardsFilesDir } = Meteor.settings.AWSS3Bucket;

    const fut = new Future();

    HTTP.call('GET', url, {
      npmRequestOptions: {
        encoding: null
      },
      responseType: 'buffer'
    }, (error, result) => {
      if (error) {
        return fut.return(new Meteor.Error(error.message));
      }

      if (!_.contains([
        'application/vnd.openxmlformats',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ], result.headers['content-type'])) {
        return fut.return(new Meteor.Error('TypeError', `Invalid content type - ${result.headers['content-type']}`));
      }

      mammoth.convertToHtml({
          buffer: result.content
        }, options)
        .then((result) => {
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
                  ${result.value}
                </div>
              </body>
            </html>
          `;
          
          const params = {
            Bucket: bucketName,
            ACL: acl,
            Key: `uploads/${organizationId}/${standardsFilesDir}/${standardId}/${Random.id()}-${fileName}`,
            Body: htmlString,
            ContentType: 'text/html; charset=UTF-8'
          };
      
          const uploader = s3.upload(params, (error, data) => {
            if (error) {
              fut.return(new Meteor.Error(error.message));
            } else {
              updateSource(standardId, source, data.Location);
              fut.return(data.Location);
            };
          });
        })
        .catch((e) => {
          fut.return(e);
        })
        .done();
    });

    return fut.wait();
  }

};
