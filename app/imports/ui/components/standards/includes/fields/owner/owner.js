import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Standards_Owner_Edit.viewmodel({
  label: 'Owner',
  owner: null,
  onCreated(template) {
    this.owner(template.data.owner || Meteor.userId());
  },
  selectArgs() {
    return {
      value: this.owner(),
      onUpdate: (viewmodel) => {
        const { selected: owner } = viewmodel.getData();

        this.owner(owner);

        if (!this._id) return undefined;

        return this.parent().update({ owner });
      },
    };
  },
  getData() {
    return { owner: this.owner() };
  },
});
