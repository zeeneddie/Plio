import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

Template.Dropdown.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing'],
  onCreated() {
    const items = this.items();

    if (!this._id() && items.count() > 0) {
      const { _id, title } = items.fetch()[0];

      this._id(_id);
      this.value(title);
    } else if (!!this._id() && items.count() > 0) {
      const find = items.fetch().filter(item => item._id === this._id());
      const item = find.length > 0 && find[0];
      this.value(item.title);
    }
  },
  value: '',
  _id: '',
  placeholder: 'Text',
  content: '',
  select({ _id, title }) {
    this.value(title);
    this._id(_id);
    this.update();
  },
  update() {
    const _id = this._id();

    this.fixValue();

    if (_id === this.templateInstance.data._id) return;

    this.onUpdate(this);
  },
  fixValue() {
    if (!!this._id() && !this.value()) {
      const find = this.items().fetch().filter(doc => doc._id === this._id());
      const item = !!find.length > 0 && find[0];
      !!item && this.value(item.title);
    }
  },
  getData() {
    const { value, _id, items } = this.data();
    return { value, _id, items };
  },
  events: {
    'focus input'() {
      this.value('');
    }
  }
});
