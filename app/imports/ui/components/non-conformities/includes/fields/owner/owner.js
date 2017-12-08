import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NC_Owner_Edit.viewmodel({
  label: 'Owner',
  placeholder: 'Owner',
  _ownerId: '',
  ownerId(id) {
    if (id) return this._ownerId(id);

    return this._ownerId() || Meteor.userId();
  },
  selectArgs() {
    const { placeholder } = this.data();

    return {
      value: this.ownerId(),
      placeholder,
      onUpdate: (viewmodel) => {
        const { selected: ownerId } = viewmodel.getData();

        this.ownerId(ownerId);

        if (!this._id) return undefined;

        return this.parent().update({ ownerId });
      },
    };
  },
  getData() {
    return { ownerId: this.ownerId() };
  },
});
