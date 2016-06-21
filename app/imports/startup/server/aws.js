import AWS from 'aws-sdk';


AWS.config.update({
  accessKeyId: Meteor.settings.AWSAccessKeyId,
  secretAccessKey: Meteor.settings.AWSSecretAccessKey,
});
