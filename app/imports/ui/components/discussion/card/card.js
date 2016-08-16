import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js'

Template.Discussion_Card.viewmodel({
  standard: '',
  discussionId() {
    const { _id } = Object.assign({}, Discussions.findOne({ linkedTo: this.linkedTo(), isPrimary: true }));
    return _id;
  }
});
