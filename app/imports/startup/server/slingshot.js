import { Slingshot } from 'meteor/edgee:slingshot';
import { Random } from 'meteor/random';

import Utils from '/imports/core/utils';


const configureSlignshot = () => {
  const {
    name, acl, usersAvatarsDir,
    standardsFilesDir, improvementPlansFilesDir
  } = Meteor.settings.AWSS3Bucket;

  const fileContentDisposition = (file, metaContext) => {
    const { isDocxHtml } = metaContext;
    const fileName = file.name;
    const disposition = isDocxHtml === true ? 'inline' : 'attachment';
    return `${disposition}; filename="${fileName}"; filename*=utf-8''${fileName}`;
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

    key(file, metaContext) {
      const { userId } = metaContext;
      return `${usersAvatarsDir}/${userId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('standardsFiles', Slingshot.S3Storage, {
    bucket: name,

    acl: acl,

    contentDisposition: fileContentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { standardId } = metaContext;
      return `${standardsFilesDir}/${standardId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('improvementPlansFiles', Slingshot.S3Storage, {
    bucket: name,

    acl: acl,

    contentDisposition: fileContentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { improvementPlanId } = metaContext;
      return `${improvementPlansFilesDir}/${improvementPlanId}/${Random.id()}-${file.name}`;
    }
  });
};

// if (Utils.isProduction()) {
  configureSlignshot();
// }
