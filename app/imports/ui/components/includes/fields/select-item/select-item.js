import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SelectItem.viewmodel({
  autorun(computation) {
    const items = this.itemsArray();

    if (!this.loading() && items.length > 0) {

      if (!this.selected() && items.length > 0 && this.selectFirstIfNoSelected()) {
        const { _id, title } = items[0];

        this.selected(_id);
        this.value(title);
      } else if (!!this.selected() && items.length > 0) {
        const find = items.filter(item => item._id === this.selected());
        const item = find.length > 0 && find[0];

        this.value(item.title);
      }
      computation.stop();
    }
  },
  value: '',
  selected: '',
  placeholder: '',
  content: '',
  isExtended: false,
  loading: false,
  focused: false,
  excludedItems: [],
  selectFirstIfNoSelected: true,
  items: [],
  itemsArray() {
    return _.isArray(this.items()) ? this.items() : this.items().fetch();
  },
  itemsFiltered() {
    return this.itemsArray().length > 0 && this.itemsArray().filter(item => !_.contains(this.excludedItems(), item._id));
  },
  select({ _id, title }) {
    this.value(title);
    this.selected(_id);
    this.update();
  },
  update() {
    this.fixValue();

    if (this.selected() === this.templateInstance.data.selected) return;

    this.onUpdate(this);
  },
  remove() {
    if (!this._id) {
      this.destroy();
    } else {
      this.onRemove(this, this.destroy());
    }
  },
  fixValue() {
    this.focused(false);

    if (!!this.selected() && !this.value()) {
      const find = this.itemsArray().filter(doc => doc._id === this.selected());
      const item = !!find.length > 0 && find[0];
      !!item && this.value(item.title);
    }
  },
  getData() {
    const { value, selected, items } = this.data();
    return { value, selected, items };
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  events: {
    'focus input'() {
      this.focused(true);
      this.value('');
    }
  }
});
