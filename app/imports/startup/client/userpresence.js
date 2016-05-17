import { UserPresence } from 'meteor/konecty:user-presence';

UserPresence.awayTime = 300000;
// Set user as away when window loses focus. Defaults false
UserPresence.awayOnWindowBlur = false;
// Start monitor for user activity
UserPresence.start();
