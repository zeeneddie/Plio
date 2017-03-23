import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NC_Owner_Edit.viewmodel({
  label: 'Owner',
  placeholder: 'Owner',
  ownerId() {
    return Meteor.userId();
  },
  selectArgs() {
    const { identifiedBy: value, placeholder } = this.data();

    return {
      value,
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
    const { ownerId = Meteor.userId() } = this.data();
    return { ownerId };
  },
});
