import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Actions_Owner.viewmodel({
  mixin: ['search', 'user', 'members'],
  ownerId: Meteor.userId(),
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:ownerId } = viewmodel.getData();

    this.ownerId(ownerId);

    this.parent().update && this.parent().update({ ownerId });
  },
  getData() {
    return { ownerId: this.ownerId() };
  }
});
