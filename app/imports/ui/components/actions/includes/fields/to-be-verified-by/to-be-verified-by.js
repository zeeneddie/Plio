import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeVerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeVerifiedBy: '',
  placeholder: 'To be verified by',
  selectFirstIfNoSelected: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeVerifiedBy(selected);

    return this.parent().update({ toBeVerifiedBy: selected });
  },
  getData() {
    return { toBeVerifiedBy: this.toBeVerifiedBy() };
  }
});
