import { Template } from 'meteor/templating';

Template.RisksSectionsItem.viewmodel({
  risks: [{ score: 91, title: 'Spillage of solvent' }, { score: 80, title: 'Explosion of binder' }]
});
