import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';

const {login, password, hostname, port} = Meteor.settings.mail;

if (Meteor.isProduction) {
  process.env.MAIL_URL = `smtp://${login}:${password}@${hostname}:${port}`;
}

try {
  const conn = DDP.connect('127.0.0.1:6000');
  console.log(conn.status());
} catch (err) {
  console.log('azazazaza');
}
