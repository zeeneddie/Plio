import { Meteor } from 'meteor/meteor';

import { Discussions } from '../discussion.js';


Meteor.publish('discussionsByStandart', function(standardId){
	return Discussions.find({standardId});
});
