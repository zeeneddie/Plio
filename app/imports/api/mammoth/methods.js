import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';

import { HTTP } from 'meteor/http';
import Future from 'fibers/future';
import mammoth from 'mammoth';

export const convertDocxToHtml = new ValidatedMethod({
    name: 'Mammoth.convertDocxToHtml',
    validate: new SimpleSchema({
        url: {
            type: SimpleSchema.RegEx.Url
        },
        options: {
            type: Object,
            optional: true,
            blackbox: true
        }
    }).validator(),
    run({ url, options }) {
        this.unblock();
        const fut = new Future();

        HTTP.call('GET', url, {
            npmRequestOptions: {
                encoding: null
            },
            responseType: 'buffer',
        }, (error, result) => {
            if (error) {
                return fut.return(new Meteor.Error(error));
            }

            if (!_.contains([
                    'application/vnd.openxmlformats',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ], result.headers['content-type'])) {
                return fut.return(new Meteor.Error('TypeError', `Invalid content type - ${result.headers['content-type']}`));
            }

            mammoth.convertToHtml({ buffer: result.content }, options)
                .then((result) => {
                    fut.return(result.value);
                })
                .catch((e) => {
                    fut.return(e);
                })
                .done();
        });

        return fut.wait();
    }
});
