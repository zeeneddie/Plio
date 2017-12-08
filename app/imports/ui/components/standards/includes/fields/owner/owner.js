import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Standards_Owner_Edit.viewmodel({
  label: 'Owner',
  _owner: '',
  owner(id) {
    if (id) return this._owner(id);

    return this._owner() || Meteor.userId();
  },
  selectArgs() {
    const { owner: value } = this.data();

    return {
      value,
      onUpdate: (viewmodel) => {
        const { selected: owner } = viewmodel.getData();
        this.owner(owner);

        if (!this._id) return;

        return this.parent().update({ owner });
      },
    };
  },
  getData() {
    return { owner: this.owner() };
  }
});
