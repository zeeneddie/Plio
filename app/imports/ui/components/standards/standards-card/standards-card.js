import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'user', 'standard', 'date'],
  standards() {
    return Standards.find({}, { sort: { title: 1 } });
  },
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
  departments() {
    const departmentsIds = !!this.standard() && this.standard().departments || [];
    const query = { _id: { $in: departmentsIds } };
    return Departments.find(query);
  },
  renderDepartments() {
    return this.departments() && this.departments().fetch().map(doc => doc.name).join(', ');
  },
  renderNotifyUsers(users) {
    return users.map(user => this.userFullNameOrEmail(user)).join(', ');
  },
  renderReviewDates(dates) {
    return dates.map(doc => this.renderDate(doc.date)).join(', ');
  },
  lessons() {
    const standardId = this.currentStandard() && this.currentStandard()._id;
    return LessonsLearned.find({ standardId }, { sort: { serialNumber: 1 } });
  },
  openEditStandardModal() {
    this.modal().open({
      title: 'Standard',
      template: 'EditStandard',
      _id: this.standard()._id
    });
  }
});
