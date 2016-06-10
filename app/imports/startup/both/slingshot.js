import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.fileRestrictions('usersAvatars', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024 // 10 MB
});

Slingshot.fileRestrictions('standardsFiles', {
  allowedFileTypes: /[a-z]+\/[a-z0-9\-]+/i,
  maxSize: 64 * 1024 * 1024 // 64 MB
});

Slingshot.fileRestrictions('improvementPlansFiles', {
  allowedFileTypes: /[a-z]+\/[a-z0-9\-]+/i,
  maxSize: 64 * 1024 * 1024 // 64 MB
});
