import BackgroundApp from '/imports/utils/server/background-app.js';


BackgroundApp.setUrl(Meteor.settings.backgroundApp.url);
BackgroundApp.connect();
