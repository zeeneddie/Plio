import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.Select_Single.viewmodel({
  mixin: 'utils',
  autorun(computation) {
    const items = this.itemsArray();

    if (!this.loading() && items.length > 0 && !this.focused()) {
      if (!this.selected() && items.length > 0 && this.selectFirstIfNoSelected()) {
        const { _id, title } = items[0];

        this.selected(_id);
        this.value(title);
        computation.stop();
      } else if (!!this.selected() && !this.value() && items.length > 0) {
        const item = this.getSelectedItem();

        this.value(item.title);
        computation.stop();
      }
    }
  },
  value: '',
  selected: null,
  placeholder: '',
  content: '',
  loading: false,
  focused: false,
  excludedItems: [],
  selectFirstIfNoSelected: true,
  items: [],
  variation: '',
  isVariation(variation) {
    return this.variation() === variation;
  },
  itemsArray() {
    return this.toArray(this.items());
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

    if (!this.onUpdate) return;

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
      const item = this.getSelectedItem();
      !!item && this.value(item.title);
    }
  },
  getSelectedItem() {
    return this.itemsArray().find(({ _id }) => _id === this.selected());
  },
  getData() {
    const { value, selected, items } = this.data();
    this.selected(this.itemsArray()[0]._id);
    const item = this.getSelectedItem();
    return { value, selected, items, item };
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  clear() {
    this.value('');
    this.selected('');
  },
  events: {
    'focus input'() {
      this.focused(true);
      this.value('');
    }
  }
});
