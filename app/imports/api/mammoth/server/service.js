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
    const updateSource = Meteor.bindEnvironment((_id, source, htmlUrl) => {
      StandardsService.update({
        _id,
        [`${source}.htmlUrl`]: htmlUrl
      });
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
            <style>
              img { 
                max-width: 100% !important; 
              } 
              body {
                padding: 30px 30px 0px 30px !important;
              }
              @media (max-width: 500px) {
                body {
                  padding: 20px 20px 0px 20px !important;
                }
              }
            </style>
            ${result.value}
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
