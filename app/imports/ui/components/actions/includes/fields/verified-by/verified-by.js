import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Actions_VerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  verifiedBy: '',
  placeholder: 'Verified by',
  selectFirstIfNoSelected: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:verifiedBy } = viewmodel.getData();

    this.verifiedBy(verifiedBy);

    return this.parent().update({ verifiedBy });
  },
  getData() {
    return { verifiedBy: this.verifiedBy() };
  }
});
