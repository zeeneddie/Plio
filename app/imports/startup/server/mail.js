import Utils from '/imports/core/utils';

const {login, password, hostname, port} = Meteor.settings.mail;

// if (Utils.isProduction()) {
  process.env.MAIL_URL = `smtp://${login}:${password}@${hostname}:${port}`;
// }
