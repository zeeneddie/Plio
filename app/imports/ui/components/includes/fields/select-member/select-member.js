import { Template } from 'meteor/templating';

const defaults = {
  value: Meteor.userId(),
  placeholder: 'Select',
  selectFirstIfNoSelected: true,
  disabled: false
};

Template.Select_Member.viewmodel({
  mixin: ['members', 'search', 'user'],
  ...defaults,
  selectArgs() {
    const {
      value: selected = defaults.value,
      placeholder = defaults.placeholder,
      selectFirstIfNoSelected = defaults.selectFirstIfNoSelected,
      disabled = defaults.disabled
    } = this.data();
    const { onUpdate = () => {} } = this.templateInstance.data;

    return {
      selected,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
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
