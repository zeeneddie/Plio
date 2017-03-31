import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NC_Originator_Edit.viewmodel({
  label: 'Originator',
  placeholder: 'Originator',
  _originatorId: '',
  originatorId(id) {
    if (id) return this._originatorId(id);

    return this._originatorId() || Meteor.userId();
  },
  selectArgs() {
    const { placeholder } = this.data();

    return {
      value: this.originatorId(),
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
    return { originatorId: this.originatorId() };
  },
});
