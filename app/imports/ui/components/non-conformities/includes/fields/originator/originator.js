import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NC_Originator_Edit.viewmodel({
  label: 'Originator',
  placeholder: 'Originator',
  originatorId() {
    return Meteor.userId();
  },
  selectArgs() {
    const { identifiedBy: value, placeholder } = this.data();

    return {
      value,
      placeholder,
      onUpdate: (viewmodel) => {
        const { selected: originatorId } = viewmodel.getData();

        this.originatorId(originatorId);

        if (!this._id) return undefined;

        return this.parent().update({ originatorId });
      },
    };
  },
  getData() {
    const { originatorId = Meteor.userId() } = this.data();
    return { originatorId };
  },
});
