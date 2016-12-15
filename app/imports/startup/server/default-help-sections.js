import { Meteor } from 'meteor/meteor';

import { DefaultHelpSections } from '/imports/share/constants';
import { HelpSections } from '/imports/share/collections/help-sections';


const insertDefaultHelpSections = () => {
  if (HelpSections.find().count()) {
    return;
  }

  DefaultHelpSections.forEach(section => HelpSections.insert(section));
};

Meteor.startup(() => {
  insertDefaultHelpSections();
});
