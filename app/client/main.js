import '/imports/startup/client';
import { Organizations } from '/imports/api/organizations/organizations.js';

Tracker.autorun(function () {
  console.log(Organizations);
  // ...
});