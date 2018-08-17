import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

Template.Actions_Owner.viewmodel({
  label: 'Owner',
  placeholder: 'Owner',
  ownerId() { return Meteor.userId(); },
  selectArgs() {
    const { ownerId: value, placeholder } = this.data();

    return {
      value,
      placeholder,
      onUpdate: (viewmodel) => {
        const { selected: ownerId } = viewmodel.getData();

        this.ownerId(ownerId);

        invoke(this.parent(), 'update', { ownerId });
      },
    };
  },
  getData() {
    const { ownerId = Meteor.userId() } = this.data();
    return { ownerId };
  },
});
