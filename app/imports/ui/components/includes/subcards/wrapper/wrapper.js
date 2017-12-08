import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.Subcards_Wrapper.viewmodel({
  mixin: ['collapse'],
  renderContentOnInitial: true,
  _lText: '',
  _rText: '',
  loading: false,
  saveAllUnsavedNewSubcards() {
    // const subcards = ViewModel.find(vm => !invoke(vm, '_id') && invoke(vm, 'isSubcard'));
    const subcards = this.parent().children(vm => !invoke(vm, '_id') && invoke(vm, 'isSubcard'));

    if (!this.collapsed() && subcards.length) {
      subcards.forEach(subcard => invoke(subcard, 'save'));

      return true;
    }

    return false;
  },
  onClick() {
    const timeout = this.renderContentOnInitial() ? 0 : 200;

    if (this.saveAllUnsavedNewSubcards()) return;

    this.toggleCollapse(null, timeout);
  },
});
