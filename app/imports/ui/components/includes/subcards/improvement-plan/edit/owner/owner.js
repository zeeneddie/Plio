import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.IP_Owner_Edit.viewmodel({
  mixin: ['search', 'user', 'members'],
  owner: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { selected:owner } = viewmodel.getData();

    if (owner === this.templateInstance.data.owner) return;

    this.owner(owner);

    this.parent().update({ 'improvementPlan.owner': owner }, cb);
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  }
});
