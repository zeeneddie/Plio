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

    this.parent().update && this.parent().update({ verifiedBy });
  },
  showUndoButton() {
    return this.onUndo && (this.verifiedBy() === Meteor.userId());
  },
  getData() {
    return { verifiedBy: this.verifiedBy() };
  }
});
