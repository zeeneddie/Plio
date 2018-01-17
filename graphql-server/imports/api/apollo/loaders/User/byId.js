import DataLoader from 'dataloader';
import { Meteor } from 'meteor/meteor';

export default new DataLoader(async ids => Meteor.users.find({ _id: { $in: ids } }).fetch());
