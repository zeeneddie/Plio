import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Standards_Owner_Edit.viewmodel({
  label: 'Owner',
<<<<<<< HEAD
  owner() { return Meteor.userId(); },
=======
  _owner: '',
  owner(id) {
    if (id) return this._owner(id);

    return this._owner() || Meteor.userId();
  },
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
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
<<<<<<< HEAD
    const { owner = Meteor.userId() } = this.data();
    return { owner };
  },
=======
    return { owner: this.owner() };
  }
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
});
