import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';

Template.StandardTypeItem.viewmodel({
  mixin: ['organization', 'standard'],
  sections() {
    const sections = ((() => {
      const query = { organizationId: this.organizationId() };
      const options = { sort: { title: 1 } };
      return StandardsBookSections.find(query, options).fetch();
    })());

    const typeId = this._id();

    return sections.filter(({ _id:sectionId }) => this._getStandardsByQuery({ sectionId, typeId }).count() > 0);
  },
  _getQuery({ _id:sectionId }) {
    const typeId = this._id();

    return { sectionId, typeId };
  }
});
