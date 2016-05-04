import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'user'],
  standard() {
    return Standards.findOne({ _id: this.selectedStandardId() });
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    return StandardsBookSections.findOne({ _id });
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    return StandardsTypes.findOne({ _id });
  },
  owner() {
    const _id = this.owner();
    return Meteor.users.findOne({ _id });
  },
  openEditStandardModal() {
    this.modal().open({
      title: 'Standard',
      template: 'EditStandard',
      closeText: 'Cancel',
      hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum accumsan nulla, non pulvinar neque. Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec maximus pellentesque, massa nunc mattis ipsum, in dictum magna arcu et ipsum.',
      _id: this.standard()._id
    });
  }
});
