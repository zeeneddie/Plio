import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NCIdentifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  identifiedBy: Meteor.userId(),
  label: 'Identified by',
  placeholder: 'Identified by',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:identifiedBy } = viewmodel.getData();

    this.identifiedBy(identifiedBy);

    if (!this._id) return;

    return this.parent().update({ identifiedBy });
  },
  getData() {
    const { identifiedBy } = this.data();
    return { identifiedBy };
  }
});
