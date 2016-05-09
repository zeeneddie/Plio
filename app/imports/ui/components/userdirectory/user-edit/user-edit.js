import { Template } from 'meteor/templating';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import { 
  updateProfile, 
  updateEmail, 
  updatePhoneNumber, 
  addPhoneNumber 
} from '/imports/api/users/methods.js';
import { assignRole, revokeRole } from '/imports/api/users/methods.js';
import { UserRoles } from '/imports/api/constants.js';


Template.UserEdit.viewmodel({
  mixin: ['organization', 'modal'],
  guideHtml() {
    return `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent vestibulum accumsan nulla, non pulvinar neque.
      Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec
      maximus pellentesque, massa nunc mattis ipsum, in dictum magna
      arcu et ipsum.</p>`;
  },
  user() {
    return Meteor.users.findOne({
      _id: this.userId()
    });
  },
  organizationId() {
    return this.organization()._id;
  },
  superpowersTitle() {
    const userName = this.user().firstName();
    const orgName = this.organization().name;
    return `${userName}'s superpowers for ${orgName}`;
  },
  updateProfile(prop, viewModel) {
    if (this.isPropChanged(prop, viewModel)) {
      this.modal().callMethod(updateProfile, {
        _id: this.userId(),
        [prop]: viewModel.getData()[prop]
      });
    }
  },
  updateEmail(viewModel) {
    if (this.isPropChanged('email', viewModel)) {
      this.modal().callMethod(updateEmail, {
        _id: this.userId(),
        email: viewModel.getData().email
      });
    }
  },
  uploadAvatarFile(viewModel) {
    const avatarFile = viewModel.avatarFile();
    if (!avatarFile) {
      return;
    }

    const uploader = new Slingshot.Upload('usersAvatars');

    this.clearError();
    this.isSaving(true);

    uploader.send(avatarFile, (err, downloadUrl) => {
      this.isSaving(false);
      viewModel.avatarFile(null);

      if (err) {
        this.setError(err);
        return;
      }

      this.modal().callMethod(updateProfile, {
        _id: this.userId(),
        avatar: downloadUrl
      });
    });
  },
  updatePhoneNumber(viewModel) {
    const { number, type } = viewModel.getData();
    const index = viewModel.index();
    
    this.modal().callMethod(updatePhoneNumber, {
      _id: this.userId(),
      index, number, type
    });
  },
  addPhoneNumber(viewModel) {
    const { number, type } = viewModel.getData();

    this.modal().callMethod(addPhoneNumber, {
      _id: this.userId(),
      number, type
    }, (err) => {
      if (!err) {
        Blaze.remove(viewModel.templateInstance.view);
      }
    });
  },
  isPropChanged(propName, viewModel) {
    const val = viewModel.getData()[propName];
    const savedVal = viewModel.templateInstance.data[propName];

    return val && val !== savedVal;
  },
  isEditable() {
    return Meteor.userId() === this.userId();
  },
  isSuperpowersEditable() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.EDIT_USER_ROLES,
      this.organizationId()
    );
  },
  userHasRole(role) {
    return Roles.userIsInRole(this.userId(), role, this.organizationId());
  },
  updateRole(role) {
    const doc = {
      _id: this.userId(),
      organizationId: this.organizationId(),
      role
    };

    if (this.userHasRole(role)) {
      this.modal().callMethod(revokeRole, doc);
    } else {
      this.modal().callMethod(assignRole, doc);
    }
  }
});
