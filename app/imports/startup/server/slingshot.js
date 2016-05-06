import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.createDirective('usersAvatars', Slingshot.S3Storage, {
  bucket: 'plio',

  acl: 'public-read',

  authorize() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
    }

    return true;
  },

  key(file) {
    return `images/avatars/${file.name}`;
  }
});
