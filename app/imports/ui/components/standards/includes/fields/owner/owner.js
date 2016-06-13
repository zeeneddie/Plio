import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ESOwner.viewmodel({
  mixin: ['search', 'user', 'members'],
  owner: Meteor.userId(),
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:owner } = viewmodel.getData();

    if (owner === this.templateInstance.data.owner) return;

    this.owner(owner);

    if (!this._id) return;

    return this.parent().update({ owner });
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  }
});
