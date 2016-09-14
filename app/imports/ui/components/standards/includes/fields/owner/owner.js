import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Standards_Owner_Edit.viewmodel({
  label: 'Owner',
  owner: Meteor.userId(),
  selectArgs() {
    const { owner:value } = this.data();

    return {
      value,
      onUpdate: (viewmodel) => {
        const { selected:owner } = viewmodel.getData();

        this.owner(owner);

        if (!this._id) return;

        return this.parent().update({ owner });
      }
    };
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  }
});
