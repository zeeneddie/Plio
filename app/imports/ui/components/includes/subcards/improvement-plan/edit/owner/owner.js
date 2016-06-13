import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.IPOwner.viewmodel({
  mixin: ['search', 'user', 'members'],
  owner: '',
  autorun(computation) {
    const child = this.child('SelectItem');
    if (this.owner() && child) {
      child.value(this.userFullNameOrEmail(this.owner()));
      computation.stop();
    }
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { selected:owner } = viewmodel.getData();

    if (owner === this.templateInstance.data.owner) return;

    this.owner(owner);

    this.parent().update({ owner }, cb);
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  }
});
