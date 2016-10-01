import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.fileRestrictions('discussionFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.discussionFilesMaxSize
});

Slingshot.fileRestrictions('userAvatars', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: Meteor.settings.public.userAvatarsMaxSize
});

Slingshot.fileRestrictions('standardFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.otherFilesMaxSize
});

Slingshot.fileRestrictions('htmlAttachmentPreview', {
  allowedFileTypes: 'text/html',
  maxSize: Meteor.settings.public.otherFilesMaxSize
});

Slingshot.fileRestrictions('improvementPlanFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.otherFilesMaxSize
});

Slingshot.fileRestrictions('nonConformityFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.otherFilesMaxSize
});

Slingshot.fileRestrictions('riskFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.otherFilesMaxSize
});

Slingshot.fileRestrictions('actionFiles', {
  allowedFileTypes: null,
  maxSize: Meteor.settings.public.otherFilesMaxSize
});
