import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';


ViewModel.persist = false;

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
    }, 500)
  },
  addForm: {
    addForm(template, context = {}) {
      if (_.isFunction(this.onChangeCb)) {
        context[onChange] = this.onChangeCb();
      }

      if (_.isFunction(this.onDeleteCb)) {
        context[onDelete] = this.onDeleteCb();
      }

      Blaze.renderWithData(
        Template[template],
        context,
        this.forms[0]
      );
    }
  },
  editableModalSection: {
    editableModal() {
      return this.parent().child('EditableModal');
    },
    isSaving(val) {
      const editableModal = this.editableModal();

      if (val !== undefined) {
        editableModal.isSaving(val);
      }

      return editableModal.isSaving();
    },
    setError(errMessage) {
      return this.editableModal().setError(errMessage);
    },
    clearError() {
      return this.editableModal().clearError();
    },
    callMethod(method, args, cb) {
      return this.editableModal().callMethod(method, args, cb);
    },
    handleMethodResult(cb) {
      return this.editableModal().handleMethodResult(cb);
    }
  },
  user: {
    userFullNameOrEmail(userOrUserId) {
      let user = userOrUserId;
      if (typeof userOrUserId === 'string') {
        user = Meteor.users.findOne(userOrUserId);
      }

      if (user) {
        const {firstName='', lastName=''} = user.profile;

        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        } else {
          return user.emails[0].address;
        }
      }
    },
    email(user) {
      return user.emails[0].address;
    },
    address(user) {
      const { address='' } = user.profile;
      return address;
    },
    avatar(user) {
      return user.profile.avatar;
    },
    description(user) {
      return user.profile.description;
    }
  },
  organization: {
    organization() {
      const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
      return Organizations.findOne({ serialNumber });
    }
  },
  userEditSection: {
    isPropChanged(propName) {
      const val = this.getData()[propName];
      const savedVal = this.templateInstance.data[propName];

      return val && val !== savedVal;
    },
    isEditable() {
      return Meteor.userId() === this.userId();
    }
  }
});
