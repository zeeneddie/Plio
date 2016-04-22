import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standardsBookSections/standardsBookSections.js';
import { StandardTypes } from '/imports/api/standardTypes/standardTypes.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  standard() {
    return Standards.findOne({ _id: this.selectedStandardId() });
  },
  renderNumber() {
    const listSubItemVm = ViewModel.findOne(vm => vm._id && vm._id() === this.standard()._id);
    return listSubItemVm && listSubItemVm.renderNumber();
  },
  renderSection() {
    const section = StandardsBookSections.findOne({ _id: this.standard().sectionId });
    return section && section.name;
  },
  renderType() {
    const type = StandardTypes.findOne({ _id: this.standard().typeId });
    return type && type.name;
  }
});
