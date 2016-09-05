import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { not } from '/imports/api/helpers.js';

const destructure = fn => (viewmodel) => {
  const {
    selectedItem:user,
    selectedItemId:userId,
    selected:users
  } = viewmodel.getData();

  return fn({ user, userId, users });
};

Template.Select_Members.viewmodel({
  mixin: ['members', 'search', 'user'],
  value: '',
  placeholder: 'Select',
  currentSelectedMembers() {
    const { value } = this.data();
    const query = { _id: { $in: value } };
    const options = { sort: { 'profile.firstName': 1 } };
    return this._mapMembers(Meteor.users.find(query, options));
  },
  selectArgs() {
    const { value, placeholder } = this.data();
    const { onUpdate = () => {}, onRemove = () => {} } = this.templateInstance.data;
    const selected = this.currentSelectedMembers();
    const hasUserId = userId => value.includes(userId);

    return {
      selected,
      placeholder,
      items: this._members(),
      onUpdate: destructure(({ user, userId, users }) => {
        if (hasUserId(userId)) return;

        return onUpdate({ user, userId, users });
      }),
      onRemove: destructure(({ user, userId, users }) => {
        if (!hasUserId(userId)) return;

        return onRemove(({ user, userId, users }));
      })
    };
  }
});
