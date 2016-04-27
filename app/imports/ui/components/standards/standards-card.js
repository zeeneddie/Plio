import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  mixin: 'modal',
  standard() {
    return Standards.findOne({ _id: this.selectedStandardId() });
  },
  section() {
    return StandardsBookSections.findOne({ _id: this.standard().sectionId });
  },
  type() {
    return StandardsTypes.findOne({ _id: this.standard().type });
  },
  renderNumber() {
    const listSubItemVm = ViewModel.findOne(vm => vm._id && vm._id() === this.standard()._id);
    return listSubItemVm && listSubItemVm.renderNumber();
  },
  owner() {
    return Meteor.users.findOne({ _id: this.owner() });
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
