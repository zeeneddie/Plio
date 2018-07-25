import { Meteor } from 'meteor/meteor';
import { UserPresence, UserPresenceMonitor } from 'meteor/konecty:user-presence';
import { InstanceStatus } from 'meteor/konecty:multiple-instances-status';

Meteor.startup(() => {
  const instance = {
    host: 'localhost',
    port: String(process.env.PORT).trim(),
  };

  if (process.env.INSTANCE_IP) {
    instance.host = String(process.env.INSTANCE_IP).trim();
  }

  InstanceStatus.registerInstance('plio', instance);

  UserPresence.start();

  return UserPresenceMonitor.start();
});
