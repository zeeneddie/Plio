import { Template } from 'meteor/templating';

const defaults = {
  placeholder: 'Select',
  selectFirstIfNoSelected: true,
  disabled: false,
  query: '',
};

Template.Select_Member.viewmodel({
  mixin: ['members', 'search', 'user'],
  ...defaults,
  selectArgs() {
    const {
      value: selected = Meteor.userId(),
      placeholder = this.placeholder(),
      selectFirstIfNoSelected = this.selectFirstIfNoSelected(),
      disabled = this.disabled(),
    } = this.data();

    const { onUpdate = () => {} } = this.templateInstance.data;

    return {
      selected,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      items: this._members(this.query() || {}),
      getAllItems: () => this._members(this.query() || {}, {}, false) || [],
      onUpdate: (viewmodel) => {
        const { selected: value } = viewmodel.getData();

        if (Object.is(value, selected)) return;

        this.value(value);

        return onUpdate(viewmodel);
      },
    };
  },
});
