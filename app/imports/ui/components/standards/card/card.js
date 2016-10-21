import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

import { ActionTypes } from '/imports/share/constants.js';
import { UncategorizedTypeSection } from '/imports/api/constants.js';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';
import { restore, remove } from '/imports/api/standards/methods.js';
import { StandardsHelp } from '/imports/api/help-messages.js';
import { isOrgOwner, isMobileRes } from '/imports/api/checkers.js';


Template.Standards_Card_Read.viewmodel({
  share: 'window',
  mixin: ['modal', 'user', 'organization', 'standard', 'date', 'roles', 'router', 'collapsing', 'collapse', 'workInbox'],
  _subHandlers: [],
  isReady: false,

  onCreated(template) {
    template.autorun(() => {
      const _id = this._id();
      const organizationId = this.organizationId();
      const _subHandlers = [];
      if (_id && organizationId) {
        _subHandlers.push(DocumentCardSubs.subscribe('standardCard', { _id, organizationId }));
        this._subHandlers(_subHandlers);
      }
    });

    template.autorun(() => {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    });
  },
  onRendered(template) {
    template.autorun(() => {
      this.collapsed(this.hasDocxAttachment());

      // Workaround for https://github.com/twbs/bootstrap/issues/2274
      template.$('.list-group-collapse.collapse').height('auto');
    });
  },
  closeAllOnCollapse: false,
  isFullScreenMode: false,
  isDiscussionOpened: false,
  ActionTypes() {
    return ActionTypes;
  },
  isOrgOwner({ organizationId } = {}) {
    return isOrgOwner(Meteor.userId(), organizationId);
  },
  toggleScreenMode() {
    const $div = this.templateInstance.$('.content-cards-inner');
    const offset = $div.offset();
    if (this.isFullScreenMode()) {
      this.isFullScreenMode(false);

      setTimeout(() => {
        $div.css({ 'position': 'inherit', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'transition': 'none' });
      }, 150);
    } else {
      $div.css({ 'position': 'fixed', 'top': offset.top, 'right': $(window).width() - (offset.left + $div.outerWidth()), 'bottom': '0', 'left': offset.left });

      setTimeout(() => {

        // Safari workaround
        $div.css({ 'transition': 'all .15s linear' });
        this.isFullScreenMode(true);
      }, 100);
    }

  },
  standards() {
    const isDeleted = this.isActiveStandardFilter(3) ? true : { $in: [null, false] };
    return this._getStandardsByQuery({ isDeleted });
  },
  standard() {
    return this._getStandardByQuery({ _id: this._id() });
  },
  hasDocxAttachment() {
    const standard = this.standard();
    return ( standard && standard.source1 && standard.source1.htmlUrl ) || ( standard && standard.source2 && standard.source2.htmlUrl );
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    const section = StandardsBookSections.findOne({ _id });

    return section || UncategorizedTypeSection;
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    let type = StandardTypes.findOne({ _id });

    return type || UncategorizedTypeSection;
  },
  _getNCsQuery() {
    return { standardsIds: get(this.standard(), '_id') };
  },
  pathToDiscussion() {
    const params = {
      orgSerialNumber: this.organizationSerialNumber(),
      standardId: this.standardId()
    };
    const queryParams = { filter: this.activeStandardFilterId() };
    return FlowRouter.path('standardDiscussion', params, queryParams);
  },
  onDiscussionOpen(e) {
    e.preventDefault();

    const mobileWidth = isMobileRes()

    if (mobileWidth) {
      this.width(mobileWidth);
    }

    return FlowRouter.go(this.pathToDiscussion());
  },
  openEditStandardModal: _.throttle(function() {
    if (ViewModel.findOne('ModalWindow')) return;

    this.modal().open({
      _title: 'Compliance standard',
      template: 'EditStandard',
      helpText: StandardsHelp.standard,
      _id: get(this.standard(), '_id')
    });
  }, 1000),
  restore({ _id, title, isDeleted }) {
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
        restore.call({ _id }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Restored!', `The standard "${title}" was restored successfully.`, 'success');

            FlowRouter.setQueryParams({ filter: 1 });
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
    if (!isDeleted || !this.isOrgOwner({ organizationId })) return;

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
        remove.call({ _id }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

            const query = {};
            const options = { sort: { deletedAt: -1 } };

            const standard = this._getStandardByQuery(query, options);

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
