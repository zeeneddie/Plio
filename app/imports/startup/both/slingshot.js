import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.fileRestrictions('usersAvatars', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024 // 10 MB
});

Slingshot.fileRestrictions('standardsFiles', {
  allowedFileTypes: null,
  maxSize: 200 * 1024 * 1024 // 200 MB
});

Slingshot.fileRestrictions('htmlAttachmentPreview', {
  allowedFileTypes: 'text/html',
  maxSize: 20 * 1024 * 1024 // 20 MB
});

Slingshot.fileRestrictions('improvementPlansFiles', {
  allowedFileTypes: null,
  maxSize: 200 * 1024 * 1024 // 200 MB
});
