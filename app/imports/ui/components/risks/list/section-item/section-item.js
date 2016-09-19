import { Template } from 'meteor/templating';

// const options = this.searchText()
//               ? {
//                   sort: { sequentialId: 1, title: 1 },
//                   ...this._options(),
//                 } // prioritize id over title while searching
//               : this._options(); // translates to default value in mixin

Template.Risks_SectionItem.viewmodel({
  items: []
});
