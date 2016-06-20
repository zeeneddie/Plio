import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';

import { HTTP } from 'meteor/http';
import Future from 'fibers/future';
import mammoth from 'mammoth';
import AWS from 'aws-sdk';

import { Standards } from '/imports/api/standards/standards.js';

AWS.config.update({
    accessKeyId: Meteor.settings.AWSAccessKeyId,
    secretAccessKey: Meteor.settings.AWSSecretAccessKey,
});

const updateSource = Meteor.bindEnvironment((_id, source, htmlUrl) => {
    Standards.update(_id, {$set: {
        [`${source}.htmlUrl`]: htmlUrl
    }});
});

export const convertDocxToHtml = new ValidatedMethod({
    name: 'Mammoth.convertDocxToHtml',
    validate: new SimpleSchema({
        url: {
            type: SimpleSchema.RegEx.Url
        },
        name: {
            type: String
        },
        source: {
            type: String
        },
        id: {
            type: SimpleSchema.RegEx.Id
        },
        options: {
            type: Object,
            optional: true,
            blackbox: true
        },
    }).validator(),
    run({
        url,
        name,
        source,
        id,
        options
    }) {
        this.unblock();
        const fut = new Future();

        HTTP.call('GET', url, {
            npmRequestOptions: {
                encoding: null
            },
            responseType: 'buffer',
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
                        ContentType: 'text/html; charset=UTF-8'
                    };

                    const uploader = s3.upload(params, (error, data) => {
                        if (error) {
                            fut.return(new Meteor.Error(error.message));
                        } else {
                            updateSource(id, source, data.Location);
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
});