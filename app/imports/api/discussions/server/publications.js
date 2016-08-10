import { Meteor } from 'meteor/meteor';

import { Discussions } from '../discussions.js';


Meteor.publish('discussionsByStandardId', function(standardId){
  return Discussions.find(
    {documentType: 'standard', linkedTo: standardId},
    { fields: {_id: 1, documentType: 1, linkedTo: 1} }
  );
});
