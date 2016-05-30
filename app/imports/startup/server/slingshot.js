import { Slingshot } from 'meteor/edgee:slingshot';
import Utils from '/imports/core/utils';

const configureSlignshot = () => {
  const {
    name, acl, avatarsDir,
    attachmentsDir, improvementPlanFilesDir
  }  = Meteor.settings.AWSS3Bucket;

  const fileContentDisposition = (file) => {
    const fileName = file.name;
    return `attachment; filename="${fileName}"; filename*=utf-8''${fileName}`;
  };

  Slingshot.createDirective('usersAvatars', Slingshot.S3Storage, {
    bucket: name,

    acl: acl,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file) {
      return `${avatarsDir}/${file.name}`;
    }
  });

  Slingshot.createDirective('standardsAttachments', Slingshot.S3Storage, {
    bucket: name,

    acl: acl,

    contentDisposition: fileContentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file) {
      return `${attachmentsDir}/${file.name}`;
    }
  });

  Slingshot.createDirective('improvementPlanFiles', Slingshot.S3Storage, {
    bucket: name,

    acl: acl,

    contentDisposition: fileContentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file) {
      return `${improvementPlanFilesDir}/${file.name}`;
    }
  });
};

if (Utils.isProduction()) {
  configureSlignshot();
}
