import DataLoader from 'dataloader';
import { Meteor } from 'meteor/meteor';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Meteor.users.findOne({ _id }))));
