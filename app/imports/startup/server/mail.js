import { Meteor } from 'meteor/meteor';

const {
  login, password, hostname, port,
} = Meteor.settings.mail;

if (Meteor.isProduction) {
  process.env.MAIL_URL = `smtp://${login}:${password}@${hostname}:${port}`;
}
