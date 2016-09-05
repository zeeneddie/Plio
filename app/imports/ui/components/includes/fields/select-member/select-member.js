import { Template } from 'meteor/templating';

Template.Select_Member.viewmodel({
  mixin: ['members', 'search', 'user'],
  value: Meteor.userId(),
  selectArgs() {
    const { value:selected } = this.data();
    const { onUpdate = () => {} } = this.templateInstance.data;

    return {
      selected,
      items: this._members(),
      onUpdate: (viewmodel) => {
        const { selected:value } = viewmodel.getData();

        if (Object.is(value, selected)) return;

        this.value(value);

        return onUpdate(viewmodel);
      }
    };
  }
});
