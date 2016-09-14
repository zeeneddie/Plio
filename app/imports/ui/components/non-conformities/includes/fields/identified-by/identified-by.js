import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NC_IdentifiedBy_Edit.viewmodel({
  identifiedBy: Meteor.userId(),
  label: 'Identified by',
  placeholder: 'Identified by',
  selectArgs() {
    const { identifiedBy:value, placeholder } = this.data();

    return {
      value,
      placeholder,
      onUpdate: (viewmodel) => {
        const { selected:identifiedBy } = viewmodel.getData();

        this.identifiedBy(identifiedBy);

        if (!this._id) return;

        return this.parent().update({ identifiedBy });
      }
    };
  },
  getData() {
    const { identifiedBy } = this.data();
    return { identifiedBy };
  }
});
