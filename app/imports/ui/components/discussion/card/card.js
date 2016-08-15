import { Template } from 'meteor/templating';
import { Discussions } from '/imports/api/discussions/discussions.js'

window.Discussions = Discussions;
Template.Discussion_Card.viewmodel({
  discussionId() {
    const discussion = Discussions.findOne({ linkedTo: this.linkedTo(), isPrimary: true });
    return discussion && discussion._id;
  }
});
