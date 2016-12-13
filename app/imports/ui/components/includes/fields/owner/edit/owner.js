import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Owner_Edit.viewmodel({
  label: 'Owner',
  ownerId: '',
  membersQuery: '',
  onCreated() {
    if (!this.ownerId.value) {
      this.ownerId(Meteor.userId());
    }
  },
  selectArgs() {
    const { ownerId: value } = this.getData();

    return {
      value,
      query: this.membersQuery() || {},
      onUpdate: (viewmodel) => {
        const { selected: ownerId } = viewmodel.getData();
        this.ownerId(ownerId);

        if (!this._id) return;

        this.parent().update({ ownerId });
      },
    };
  },
  getData() {
    return { ownerId: this.ownerId() };
  },
});
