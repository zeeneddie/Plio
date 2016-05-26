import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { remove } from '/imports/api/standards/methods.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'user', 'organization', 'standard', 'date', 'roles'],
  autorun() {
    const standardId = this.standard() && this.standard()._id;
    this.templateInstance.subscribe('improvementPlan', standardId);
  },
  standards() {
    return Standards.find({}, { sort: { title: 1 } });
  },
  standard() {
    return Standards.findOne({ _id: this.standardId() });
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    return StandardsBookSections.findOne({ _id });
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    return StandardTypes.findOne({ _id });
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
  improvementPlan() {
    return ImprovementPlans.findOne({});
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
      title: 'Compliance standard',
      template: 'EditStandard',
      _id: this.standard()._id
    });
  },
  delete({ _id, title, isDeleted, organizationId }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be removed forever!`,
        type: 'warning',
        html: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        remove.call({ _id, organizationId }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed succesfully.`, 'success');

            FlowRouter.setParams({ standardId: '' });
            Tracker.flush();
            // FlowRouter.go('standards', { orgSerialNumber: this.organizationSerialNumber() });
          }
        });
      }
    );
  }
});
