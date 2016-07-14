import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { update, remove } from '/imports/api/non-conformities/methods.js';
// import { update, remove } from '/imports/api/standards/methods.js';

Template.SS_Card_Read.viewmodel({
  share: 'standard',
  mixin: ['standard', 'roles', 'organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'problemsStatus', 'collapse', 'router', 'collapsing'],
  customNC: {
    "_id": "P98SExuNHZ4y8bhjc",
    "organizationId": "KwKXz5RefrE5hjWJ2",
    "serialNumber": 2,
    "sequentialId": "NC2",
    "title": "Inquiry not recorded",
    "identifiedBy": "SQHmBKJ94gJvpLKLt",
    "identifiedAt": new Date("2016-04-01T11:00:00.000Z"),
    "magnitude": "critical",
    "createdAt": new Date( "2016-07-05T13:06:37.419Z"),
    "createdBy": "SQHmBKJ94gJvpLKLt",
    //use
    "notify": [
      "SQHmBKJ94gJvpLKLt"
    ],
    "status": 1,
    "description": "Deal valuations not carried out with new client resulting in problems agreeing valuations later",
    "cost": 5000,
    "viewedBy": [
      null,
      "SQHmBKJ94gJvpLKLt"
    ],
    //use
    "analysis": {
      "status": 0,
      "executor": "RifbrzLTCGKPGbENM",
      "targetDate": new Date("2016-07-24T21:00:00.000Z")
    },
    //use
    "updateOfStandards": {
      "status": 0
    },
    "updatedAt": new Date("2016-07-13T12:58:32.945Z"),
    "updatedBy": "SQHmBKJ94gJvpLKLt",
    "departmentsIds": [
      "3SubXSZtEZEXzDgK2"
    ],
    "standardsIds": [
      "Mc7jjwYJ9gXPkibS8"
    ],
    "departments": [
      "m72qqQWLSE2o3E7NZ",
      "ya3tYSktWn9nQwCDG"
    ]
  },
  docForIP: {
    "_id" : "7dNe83CStYvYj4r8b",
    "documentId" : "P98SExuNHZ4y8bhjc",
    "documentType" : "non-conformity",
    "desiredOutcome" : "Test",
    "createdAt" : new Date("2016-07-13T12:59:35.129Z"),
    "createdBy" : "SQHmBKJ94gJvpLKLt",
    "targetDate" : new Date("2016-07-24T21:00:00Z"),
    "updatedAt" : new Date("2016-07-13T13:00:09.700Z"),
    "updatedBy" : "SQHmBKJ94gJvpLKLt",
    "owner" : "MJ97dnvMYrJ35pMNq",
    "files" : [
      {
        "_id" : "vS9fqxuP5hupxGsZa",
        "name" : "examples.desktop",
        "extension" : "desktop",
        "url" : "https://plio.s3-eu-west-1.amazonaws.com/uploads/KwKXz5RefrE5hjWJ2/improvement-plans-files/undefined/7xHEQ7kkNqCxyjiWx-examples.desktop"
      }
    ]
  },
  customStandard: {
    "_id": "qN8gh9k5J2nAqi8Pc",
    "organizationId": "KwKXz5RefrE5hjWJ2",
    "title": "sda",
    "sectionId": "sktksJAYjHYJmNYaM",
    "typeId": "jPv9Jd7n9iC9MdtfC",
    "owner": "SQHmBKJ94gJvpLKLt",
    "issueNumber": 1000,
    "status": "issued",
    "nestingLevel": 1,
    "viewedBy": [
      "SQHmBKJ94gJvpLKLt"
    ],
    "notify": [
      "SQHmBKJ94gJvpLKLt"
    ],
    "createdAt": "2016-07-11T10:42:59.380Z",
    "createdBy": "SQHmBKJ94gJvpLKLt",
    "updatedAt": "2016-07-11T12:06:17.252Z",
    "updatedBy": "SQHmBKJ94gJvpLKLt"
  },
  customRisk: {
    "_id": "movmNy9rFvYHshu6X",
    "organizationId": "KwKXz5RefrE5hjWJ2",
    "serialNumber": 1,
    "sequentialId": "RK1",
    "title": "Spillage of solvent",
    "identifiedBy": "SQHmBKJ94gJvpLKLt",
    "identifiedAt": new Date("2016-04-01T11:00:00.000Z"),
    "magnitude": "major",
    "typeId": "jzNDq2RgCd8JshYD9",
    "createdAt": new Date("2016-07-05T13:06:37.453Z"),
    "createdBy": "SQHmBKJ94gJvpLKLt",
    "viewedBy": [
      null,
      "SQHmBKJ94gJvpLKLt"
    ],
    "notify": [
      "SQHmBKJ94gJvpLKLt"
    ],
    "analysis": {
      "status": 0
    },
    "updateOfStandards": {
      "status": 0
    },
    "status": 1,
    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    "standardId": "Mc7jjwYJ9gXPkibS8",
    "score": {
      "rowId": 1,
      "value": 95,
      "scoredBy": "SQHmBKJ94gJvpLKLt",
      "scoredAt": new Date("2016-04-01T11:00:00.000Z")
    },
    "updatedAt": new Date("2016-07-14T07:11:01.908Z"),
    "updatedBy": "SQHmBKJ94gJvpLKLt",
    "treatmentPlan": {
      "comments": "New treatment plan",
      "prevLossExp": "Comment",
      "priority": "medium",
      "decision": "treat"
    }
  },
  getCustomQuery() {
    // need it for Subcards_Occurrences_Read
    return {};
  },
  getCustomNCsQuery() {
    // need it for Subcards_NonConformities_Read
    return {};
  },
  autorun() {
    this.templateInstance.subscribe('NCImprovementPlan', this.NCId());
  },
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('standardImprovementPlan', this.standardId());
      template.subscribe('departments', this.organizationId());
      template.subscribe('nonConformitiesByStandardId', this.standardId());
    });
  },
  onRendered(template) {
    template.autorun(() => {
      this.collapsed(this.hasDocxAttachment());

      // Workaround for https://github.com/twbs/bootstrap/issues/2274
      template.$('.list-group-collapse.collapse').height('auto');
    });
  },

  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      _title: 'Non-conformity',
      template: 'NC_Card_Edit',
      _id: this.NCId()
    });
  },
  onRestoreCb() {
    return this.restore.bind(this);
  },
  restore({ _id, isDeleted, title }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        FlowRouter.setQueryParams({ by: 'magnitude' });
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    update.call({ _id, isDeleted: false }, callback);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        const NCs = this._getNCsByQuery({});

        if (NCs.count() > 0) {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0);
        }
      });
    };

    remove.call({ _id }, callback);
  },



  // Standards
  closeAllOnCollapse: false,
  isFullScreenMode: false,
  toggleScreenMode() {
    const $div = this.templateInstance.$('.content-cards-inner');
    const offset = $div.offset();
    if (this.isFullScreenMode()) {
      this.isFullScreenMode(false);

      setTimeout(() => {
        $div.css({ 'position': 'inherit', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'transition': 'none' });
      }, 150);
    } else {
      $div.css({ 'position': 'fixed', 'top': offset.top, 'right': '0', 'bottom': '0', 'left': offset.left });

      setTimeout(() => {

        // Safari workaround
        $div.css({ 'transition': 'all .15s linear' });
        this.isFullScreenMode(true);
      }, 100);
    }

  },
  hasStandards() {
    return this.standards().count() > 0;
  },
  standards() {
    return this._getStandardsByQuery({});
  },
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  hasDocxAttachment() {
    const standard = this.standard();
    return ( standard && standard.source1 && standard.source1.htmlUrl ) || ( standard && standard.source2 && standard.source2.htmlUrl );
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    return StandardsBookSections.findOne({ _id });
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    return StandardTypes.findOne({ _id });
  },
  _getNCsQuery() {
    return { standardsIds: this.standardId() };
  },
  openEditStandardModal() {
    this.modal().open({
      _title: 'Compliance standard',
      template: 'EditStandard',
      _id: this.standardId()
    });
  },
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
        update.call({ _id, isDeleted: false }, (err) => {
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
  delete({ _id, title, isDeleted }) {
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
