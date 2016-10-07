import { Slingshot } from 'meteor/edgee:slingshot';
import { Random } from 'meteor/random';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { isOrgMember } from '/imports/api/checkers.js';
import Utils from '/imports/core/utils';


const configureSlingshot = () => {
  const {
    bucketName, acl, ussionsFilesDir, userAvatarsDir,
    standardFilesDir, improvementPlanFilesDir,
    nonConformityFilesDir, riskFilesDir,
    actionFilesDir, rootCauseAnalysisFilesDir,
    discussionFilesDir
  } = Meteor.settings.AWSS3Bucket;

  const attachmentDisposition = (file, metaContext) => {
    const fileName = file.name;
    const disposition = 'attachment';
    return `${disposition}; filename="${fileName}"; filename*=utf-8''${fileName}`;
  };

  Slingshot.createDirective('discussionFiles', Slingshot.S3Storage, {
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
      const { organizationId, discussionId } = metaContext;
      return `uploads/${organizationId}/${discussionFilesDir}/${discussionId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('userAvatars', Slingshot.S3Storage, {
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
      return `${userAvatarsDir}/${userId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('standardFiles', Slingshot.S3Storage, {
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
      return `uploads/${organizationId}/${standardFilesDir}/${standardId}/${Random.id()}-${file.name}`;
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
      return `uploads/${organizationId}/${standardFilesDir}/${standardId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('improvementPlanFiles', Slingshot.S3Storage, {
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
      return `uploads/${organizationId}/${improvementPlanFilesDir}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('nonConformityFiles', Slingshot.S3Storage, {
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
      return `uploads/${organizationId}/${nonConformityFilesDir}/${nonConformityId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('riskFiles', Slingshot.S3Storage, {
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
      const { organizationId, riskId } = metaContext;
      return `uploads/${organizationId}/${riskFilesDir}/${riskId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('actionFiles', Slingshot.S3Storage, {
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
      const { organizationId, actionId } = metaContext;
      return `uploads/${organizationId}/${actionFilesDir}/${actionId}/${Random.id()}-${file.name}`;
    }
  });

  Slingshot.createDirective('rootCauseAnalysisFiles', Slingshot.S3Storage, {
    bucket: bucketName,

    acl: acl,

    contentDisposition: attachmentDisposition,

    authorize(file, metaContext) {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
      }

      const NC = NonConformities.findOne({ _id: metaContext.nonConformityId });
      if (!NC) {
        throw new Meteor.Error(400, 'Non-conformity does not exist');
      }

      if (!isOrgMember(this.userId, NC.organizationId)) {
        throw new Meteor.Error(
          403, 'User is not authorized for uploading files in this organization'
        );
      }

      return true;
    },

    key(file, metaContext) {
      const { nonConformityId } = metaContext;
      const { organizationId } = NonConformities.findOne({ _id: nonConformityId });

      return `uploads/${organizationId}/${rootCauseAnalysisFilesDir}/${nonConformityId}/${Random.id()}-${file.name}`;
    }
  });
};

// if (Utils.isProduction()) {
  configureSlingshot();
// }
