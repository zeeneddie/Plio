const { login, password, hostname, port } = Meteor.settings.mail;

process.env.MAIL_URL = `smtp://${login}:${password}@${hostname}:${port}`;
