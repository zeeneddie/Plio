import { UserPresence, UserPresenceMonitor } from 'meteor/konecty:user-presence';

//SERVER
// Listen for new connections, login, logoff and application exit to manage user status and register methods to be used by client to set user status and default status
UserPresence.start();

// Listen for changes in UserSessions and Meteor.users to set user status based on active connections
// UserPresenceMonitor.start();
