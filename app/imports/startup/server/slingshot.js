import { Slingshot } from 'meteor/edgee:slingshot';


const s3BucketSettings = Meteor.settings.AWSS3Bucket;

Slingshot.createDirective('usersAvatars', Slingshot.S3Storage, {
  bucket: s3BucketSettings.name,

  acl: s3BucketSettings.acl,

  authorize() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
    }

    return true;
  },

  key(file) {
    return `${s3BucketSettings.avatarsDir}/${file.name}`;
  }
});
