import { Slingshot } from 'meteor/edgee:slingshot';
import { Random } from 'meteor/random';

import Utils from '/imports/core/utils';


const configureSlignshot = () => {
  const {
    bucketName, acl, usersAvatarsDir,
    standardsFilesDir, improvementPlansFilesDir
  } = Meteor.settings.AWSS3Bucket;

  const attachmentDisposition = (file, metaContext) => {
    const fileName = file.name;
    const disposition = 'attachment';
    return `${disposition}; filename="${fileName}"; filename*=utf-8''${fileName}`;
  };

  Slingshot.createDirective('usersAvatars', Slingshot.S3Storage, {
    bucket: bucketName,

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
    bucket: bucketName,

    acl: acl,

    contentDisposition: attachmentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { organizationId, standardId } = metaContext;
      return `uploads/${organizationId}/${standardsFilesDir}/${standardId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('htmlAttachmentPreview', Slingshot.S3Storage, {
    bucket: bucketName,

    acl: acl,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { organizationId, standardId } = metaContext;
      return `uploads/${organizationId}/${standardsFilesDir}/${standardId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('improvementPlansFiles', Slingshot.S3Storage, {
    bucket: bucketName,

    acl: acl,

    contentDisposition: attachmentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { organizationId, improvementPlanId } = metaContext;
      return `uploads/${organizationId}/${improvementPlansFilesDir}/${improvementPlanId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('nonConformitiesFiles', Slingshot.S3Storage, {
    bucket: bucketName,

    acl: acl,

    contentDisposition: attachmentDisposition,

    authorize() {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      return true;
    },

    key(file, metaContext) {
      const { organizationId, nonConformityId } = metaContext;
      return `uploads/${organizationId}/${nonConformitiesFilesDir}/${nonConformityId}/${Random.id()}-${file.name}`;
    }
  });
};

// if (Utils.isProduction()) {
  configureSlignshot();
// }
