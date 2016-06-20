import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';

import AWS from 'aws-sdk';
import Future from 'fibers/future';
import mammoth from 'mammoth';

import StandardsService from '/imports/api/standards/standards-service.js';


export default {

  convertToHtml({ url, name, source, standardId, options }) {
    const updateSource = Meteor.bindEnvironment((_id, source, htmlUrl) => {
      StandardsService.update({
        _id,
        [`${source}.htmlUrl`]: htmlUrl
      });
    });

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
          const params = {
            Bucket: Meteor.settings.AWSS3Bucket.name,
            ACL: Meteor.settings.AWSS3Bucket.acl,
            Key: `${Meteor.settings.AWSS3Bucket.attachmentsDir}/${name}`,
            Body: result.value,
            ContentType: 'text/html',
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
