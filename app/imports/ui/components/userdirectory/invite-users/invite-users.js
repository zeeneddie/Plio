import { Template } from 'meteor/templating';
import { inviteMultipleUsersByEmail } from '/imports/api/organizations/methods'

Template.UserDirectory_InviteUsers.viewmodel({
  welcomeMessage: 'Hi there. We\'ll be using Plio to store documents, complete worksheets and track issues during this project.',
  usersEntries: _.range(1, 5).map((i) => {
    return {avatarIndex: i};
  }),

  onSubmitModal() {
    let modalWindowInstance = this.child('ModalWindow');

    let emailViewModels = this.children('UserDirectory_InviteUsers_UserEntry');

    let emails = emailViewModels.map(userEntryViewModel => userEntryViewModel.data().email);
    let welcomeMessage = this.welcomeMessage();
    let organizationId = this.organizationId();

    modalWindowInstance.callMethod(inviteMultipleUsersByEmail, {
      organizationId, emails, welcomeMessage
    });
  }
});