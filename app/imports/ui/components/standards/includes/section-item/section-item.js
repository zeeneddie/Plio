import { Template } from 'meteor/templating';

Template.StandardSectionItem.viewmodel({
  share: 'search',
  mixin: ['search', 'standard', 'organization'],
  _query: {},
  standards() {
    return this._getStandardsByQuery({
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'description' }, { name: 'status' }]),
      ...this._query()
    });
  },
  isNestingLevel({ nestingLevel }, level) {
    return nestingLevel === level;
  }
});
