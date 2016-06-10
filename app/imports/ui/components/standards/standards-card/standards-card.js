import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { update, remove } from '/imports/api/standards/methods.js';

Template.StandardsCard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'user', 'organization', 'standard', 'date', 'roles', 'router', 'collapsing', 'collapse'],
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('improvementPlan', this.standardId());
      template.subscribe('departments', this.organizationId());
    });

    this.collapsed(false);
  },
  closeAllOnCollapse: false,
  standards() {
    const query = { organizationId: this.organizationId() };
    const sQuery = this.isActiveStandardFilter('deleted') ? { ...query, isDeleted: true } : query;
    const options = { sort: { title: 1 } };
    return Standards.find(sQuery, options);
  },
  standard() {
    const query = { _id: this.standardId(), organizationId: this.organizationId() };
    const filterQuery = this.isActiveStandardFilter('deleted') ? { ...query, isDeleted: true } : query;
    return Standards.findOne(filterQuery);
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    return StandardsBookSections.findOne({ _id });
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    return StandardTypes.findOne({ _id });
  },
  openEditStandardModal() {
    this.modal().open({
      title: 'Compliance standard',
      template: 'EditStandard',
      _id: this.standardId()
    });
  },
  restore({ _id, title, isDeleted, organizationId }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be restored!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Restore',
        closeOnConfirm: false,
      },
      () => {
        update.call({ _id, organizationId, isDeleted: false }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Restored!', `The standard "${title}" was restored successfully.`, 'success');

            FlowRouter.setQueryParams({ by: 'section' });
            Meteor.setTimeout(() => {
              this.goToStandard(_id);
              this.expandCollapsed(_id);
            }, 0);
          }
        });
      }
    );
  },
  delete({ _id, title, isDeleted, organizationId }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be deleted permanently!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        remove.call({ _id, organizationId }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

            const query = { organizationId: this.organizationId(), isDeleted: true };
            const options = { sort: { deletedAt: -1 } };

            const standard = Standards.findOne(query, options);

            if (!!standard) {
              const { _id } = standard;

              Meteor.setTimeout(() => {
                this.goToStandard(_id);
                this.expandCollapsed(_id);
              }, 0);
            }
          }
        });
      }
    );
  }
});
