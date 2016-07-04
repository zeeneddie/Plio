import { Template } from 'meteor/templating';

Template.ActionSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search', 'action'],
  _query: {},
  onCreated() {
    console.log(this._query());
  },
  actions() {
    return this._getActionsByQuery({
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      ...this._query()
    });
  }
});
