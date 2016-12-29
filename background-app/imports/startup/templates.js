import { Meteor } from 'meteor/meteor';

import TemplateStore from '/imports/utils/template-store';


Meteor.startup(() => {
  TemplateStore.loadTemplates();
});
