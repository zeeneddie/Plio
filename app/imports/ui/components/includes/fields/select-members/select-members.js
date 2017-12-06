import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

const destructure = fn => (viewmodel) => {
  const {
    selectedItem: user,
    selectedItemId: userId,
    selected: users,
  } = viewmodel.getData();

  return fn({ user, userId, users });
};

Template.Select_Members.viewmodel({
  mixin: ['members', 'search', 'user'],
  values: [],
  placeholder: 'Select',
  query: '',
  currentSelectedMembers() {
    const { values } = this.data();
    const query = { _id: { $in: values } };
    const options = { sort: { 'profile.firstName': 1 } };
    return this._mapMembers(Meteor.users.find(query, options));
  },
  selectArgs() {
    const { values, placeholder } = this.data();
    const { onUpdate = () => {}, onRemove = () => {} } = this.templateInstance.data;
    const selected = this.currentSelectedMembers();
    const hasUserId = userId => values.includes(userId);

    return {
      selected,
      placeholder,
      items: this._members(this.query() || {}),
      onUpdate: destructure(({ user, userId, users }) => {
        if (hasUserId(userId)) return;

        this.values().push(userId);

        return onUpdate({ user, userId, users });
      }),
      onRemove: destructure(({ user, userId, users }) => {
        if (!hasUserId(userId)) return;

        this.values().remove(userId);

        return onRemove(({ user, userId, users }));
      }),
    };
  },
});
